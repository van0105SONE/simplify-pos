const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const waitOn = require('wait-on');

const fs = require('fs'); // ✅ make sure fs is imported here
const { PrismaClient } = require('@prisma/client');
const ElectronStore = require('electron-store').default;
const serve = require("electron-serve").default;

// Make sure to resolve the absolute path to 'out' directory
const loadURL = serve({ directory: path.join(__dirname, "../out") });




// Get a writable path for the database
const userDataPath = app.getPath("userData"); // e.g., C:\Users\<user>\AppData\Roaming\<YourApp>
const databasePath = path.join(userDataPath, "dev.db");

// If you have a default dev.db, copy it to userData folder if it doesn't exist
const defaultDbPath = path.join(__dirname, "../prisma/dev.db");
if (!fs.existsSync(databasePath)) {
  fs.copyFileSync(defaultDbPath, databasePath);
}

// Override DATABASE_URL for Prisma
process.env.DATABASE_URL = `file:${databasePath}`;

const prisma = new PrismaClient();
// data persitant
const store = new ElectronStore(); // Initialize electron-store

// --- escpos import ---
const escpos = require('escpos');
const { connect } = require('http2');
escpos.USB = require('escpos-usb'); // npm install escpos escpos-usb

let win;
let nextProcess;

const SYSTEM_CURRENCY = [
  { code: "THB", currency_name: "Thai Baht", symbol: "฿", is_main: true },
  { code: "CNY", currency_name: "Chinese Yuan", symbol: "¥", is_main: false },
  { code: "MMK", currency_name: "Myanmar Kyat", symbol: "K", is_main: false },

  { code: "USD", currency_name: "US Dollar", symbol: "$", is_main: false },
  { code: "EUR", currency_name: "Euro", symbol: "€", is_main: false },
  { code: "GBP", currency_name: "British Pound", symbol: "£", is_main: false },
  { code: "JPY", currency_name: "Japanese Yen", symbol: "¥", is_main: false },
  { code: "AUD", currency_name: "Australian Dollar", symbol: "A$", is_main: false },
  { code: "CAD", currency_name: "Canadian Dollar", symbol: "CA$", is_main: false }]
// Add more currencies as needed


function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
    },
  });

  //loadURL(win)

  win.loadURL('http://localhost:3000')
}

app.whenReady().then(async () => {
  // Decide between dev and prod
  // const isDev = process.env.NODE_ENV === 'development';

  // nextProcess = spawn('npm', [isDev ? 'run' : '', isDev ? 'dev' : 'start'].filter(Boolean), {
  //   shell: true,
  //   stdio: 'inherit',
  // });
  //seed default data for the system
  const user = await prisma.user.findFirst({
    where: {
      username: "SuperAdmin"
    }
  })
  if (!user) {
    await prisma.user.create({
      data: {
        name: "SuperAdmin",
        username: "SuperAdmin",
        password: "P@ssw0rd",
        role: "Admin",
        phone: '201111111'
      },
    });
    console.log("Seeded default admin user");
  }

  SYSTEM_CURRENCY.forEach(async (item) => {
    const isExist = await prisma.currency.findFirst({
      where: {
        code: item.code
      }
    })

    if (!isExist) {
      await prisma.currency.create({
        data: {
          code: item.code,
          currency_name: item.currency_name,
          symbol: item.symbol,
          is_main: item.is_main
        }
      })
    }
  })





  // --- Printer handler ---
  ipcMain.handle('print-receipt', async (event, content) => {
    try {
      const device = new escpos.USB();
      const printer = new escpos.Printer(device);

      return new Promise((resolve, reject) => {
        device.open((err) => {
          if (err) {
            console.error('Printer connection failed:', err);
            reject('Printer not connected');
            return;
          }

          printer
            .align('ct')
            .text(content)
            .cut()
            .close();

          resolve('Printed successfully');
        });
      });
    } catch (err) {
      console.error('ESC/POS printing error:', err);
      return 'error';
    }
  });

  ipcMain.handle('print-to-pdf', async (event, htmlContent) => {
    try {
      const pdfWin = new BrowserWindow({ show: false }); // hidden window
      await pdfWin.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(htmlContent));

      const pdfBuffer = await pdfWin.webContents.printToPDF({ printBackground: true });
      const filePath = path.join(app.getPath('desktop'), `${new Date().getTime()}.pdf`);
      fs.writeFileSync(filePath, pdfBuffer);


      return { success: true, filePath };
    } catch (err) {
      console.error('PDF print failed:', err);
      return { success: false, error: err.message };
    }
  });
  // Login handler
  ipcMain.handle('log-in', async (event, { username, password }) => {
    try {
      console.log('it about to verify:.....')
      const user = await prisma.user.findUnique({
        where: { username },
      });

      console.log('user data: ', user)
      console.log('password: ', password, "user password: ", user.password)
      if (!user || password !== user.password) {
        return { success: false, error: 'Invalid credentials', user: null };
      }



      // Store user data and token in electron-store
      // Store user data and token
      const authData = {
        user: { id: user.id, username: user.username, role: user.role }
      };
      store.set('auth', authData);
      console.log('Stored auth:', store.get('auth')); // Verify immediately after setting

      return {
        success: true,
        user: { id: user.id, username: user.username, role: user.role},
      };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Internal server error', user: null };
    }
  });

  ipcMain.handle('getUser', async () => {
    try {
      const authData = store.get('auth');

      if (!authData) {
        return null;
      }

      const user = await prisma.user.findUnique({
        where: { id: authData.user.id },
        select: { id: true, username: true, role: true },
      });

      if (!user) {
        store.delete('auth'); // Clear invalid data
        return null;
      }

      return { id: user.id, username: user.username, role: user.role };
    } catch (error) {
      console.error('Get user error:', error);
      store.delete('auth'); // Clear on error (e.g., expired token)
      return null;
    }
  });

  ipcMain.handle('get-all-users', async (event) => {
    const products = await prisma.user.findMany(); // your DB logic
    return products;
  });

  ipcMain.handle('create-user', async (event, body) => {
    const user = await prisma.user.create({
      data: {
        name: body.name,
        username: body.username,
        password: body.password,
        role: body.role,
        phone: body.phone,
      }
    });
    return true;
  });

  ipcMain.handle('logout', async () => {
    try {
      store.delete('auth'); // Clear auth data
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: 'Logout failed' };
    }
  });


  ipcMain.handle('get-products', async (event) => {
    const menues = await prisma.Menues.findMany(
      {
        include: {
          category: true, // Include category details if needed
        },
      }
    );
    return menues;
  });


  ipcMain.handle('get-product-by-id', async (event, id) => {
    if (!id) {
      return NextResponse.json({ status: 400 });
    }

    const product = await prisma.menues.findFirst({
      where: { id },
      include: { category: true },
    });
    return product;
  });


  ipcMain.handle('create-product', async (event, body) => {
    await prisma.menues.create({
      data: {
        image: '',
        name: body.name,
        price: body.price,
        description: 'N/A',
        stock: body.stock,
        unitType: body.unitType,
        users: {
          connect: {
            id: body.users.id
          }
        },
        category: {
          connect: {
            id: body.category_id
          }
        }
      }
    });
  })

  ipcMain.handle('edit-product', async (event, body) => {
    const exist = await prisma.menues.findFirst({
      where: {
        id: body.id
      }
    })
    if (!exist) {
      return;
    }

    await prisma.menues.update({
      where: {
        id: body.id
      },
      data: {
        image: '',
        name: body.name,
        price: body.price,
        description: 'N/A',
        stock: body.stock,
        unitType: body.unitType,
        category: {
          connect: {
            id: body.category_id
          }
        }
      }
    });
  })

  ipcMain.handle('delete-product', async (event, id) => {
    if (!id) {
      return NextResponse.json({ message: 'Product ID is required' }, { status: 400 });
    }

    const productExists = await prisma.menues.findUnique({
      where: { id: id }
    });

    if (!productExists) {
      return NextResponse.json({ message: 'Product is not founded.' }, { status: 400 });
    }
    await prisma.menues.delete({
      where: { id: productExists.id }
    });
  })


  ipcMain.handle('create-table', async (event, body) => {
    await prisma.table.create({
      data: {
        name: body.name,
        seat: body.seat,
        status: false,
        users: {
          connect: {
            id: body.users.id
          }
        },
      }
    });

    return true;
  })

  ipcMain.handle('delete-table', async (event, id) => {
    await prisma.table.delete({
      where: {
        id: id
      }
    });
  })

  ipcMain.handle('edit-table', async (event, body) => {
    const table = await prisma.table.findFirst({
      where: {
        id: Number(body.id)
      }
    });

    if (!table) {
      return false;
    }

    await prisma.table.update({
      where: {
        id: table.id
      },
      data: {
        name: body.name,
        seat: body.seat,
        status: body.status
      }
    });

    return true;
  })

  ipcMain.handle('get-table-by-id', async (event, id) => {
    const table = await prisma.table.findFirst({
      where: {
        id: Number(id)
      }
    });

    return table;
  })
  ipcMain.handle('get-tables', async (event) => {
    const tables = await prisma.table.findMany({
      include: {
        users: true
      }
    }); // your DB logic
    return tables;
  });

  ipcMain.handle('create-supply', async (event, body) => {
    await prisma.supplier.create({
      data: {
        name: body.name,
        stock: body.stock,
        import_price: body.import_price,
        status: body.status,
        users: {
          connect: {
            id: body.users.id
          }
        }
      }
    });
    return true;
  })

  ipcMain.handle('edit-supply', async (event, body) => {
    await prisma.supplier.update({
      where: {
        id: body.id
      },
      data: {
        name: body.name,
        stock: body.stock,
        import_price: body.import_price,
        status: body.status
      }
    });
    return true;
  })

  ipcMain.handle('delete-supply', async (event, id) => {
    const supplierExist = await prisma.supplier.findUnique({
      where: { id: id }
    });

    if (!supplierExist) {
      return false;
    }
    await prisma.supplier.delete({
      where: { id: supplierExist.id }
    });

    return true;
  })
  ipcMain.handle('get-supply-by-id', async (event, id) => {
    const supply = await prisma.supplier.findFirst(
      {
        where: {
          id: id
        }
      }
    ); // your DB logic
    console.log(supply)
    return supply;
  })

  ipcMain.handle('get-supplys', async (event) => {
    const supplier = await prisma.supplier.findMany({
      include: {
        users: true
      }
    }); // your DB logic

    const result = supplier.map((item) => {
      return {
        id: item.id,
        name: item.name,
        stock: Number(item.stock),
        import_price: Number(item.import_price),
        status: item.status,
        createdAt: item.createdAt,
        users: item.users
      };
    });
    return result;
  })


  ipcMain.handle('create-unitType', async (event, body) => {
    await prisma.unitType.create({
      data: {
        name: body.name,
        users: {
          connect: {
            id: body.users.id
          }
        }
      }
    });
    return true
  })

  ipcMain.handle('delete-unitType', async (event, id) => {
    const unitTypeExist = await prisma.unitType.findUnique({
      where: { id: id }
    });

    if (!unitTypeExist) {
      return false;
    }
    await prisma.unitType.delete({
      where: { id: unitTypeExist.id }
    });

    return true;
  })
  ipcMain.handle('get-unitTypes', async (event) => {
    const unitTypes = await prisma.unitType.findMany({
      include: {
        users: true
      }
    });
    return unitTypes;
  });

  ipcMain.handle('create-category', async (event, body) => {
    await prisma.category.create({
      data: {
        name: body.name,
        users: {
          connect: {
            id: body.users.id
          }
        }
      }
    });

    return true;
  });

  ipcMain.handle('delete-category', async (event, id) => {
    if (!id) {
      return false;
    }
    await prisma.category.delete({
      where: { id: id }
    });

    return true;
  })

  ipcMain.handle('get-categories', async (event) => {
    const categories = await prisma.category.findMany();
    return categories;
  });

  ipcMain.handle('get-seller', async (event) => {
    try {
      const products = await prisma.menues.findMany(); // your DB logic
      return NextResponse.json(products);
    } catch (error) {
      console.error('Error fetching products:', error);
      return NextResponse.json({ message: 'Failed to fetch products' }, { status: 500 });
    }
  })

  ipcMain.handle('create-currency', async (event, body) => {
    const isExist = await prisma.currency.findFirst({
      where: {
        symbol: body.symbol
      }
    });
    if (isExist) {
      return false;
    }
    await prisma.currency.create({
      data: {
        symbol: body.symbol,
        code: body.code,
        currency_name: body.currency_name,
        is_main: body.is_main
      }
    });

    return true;
  })
  ipcMain.handle('get-default-currency', async (event) => {
    const currency = await prisma.currency.findFirst({
      where: {
        is_main: true
      }
    });

    return currency
  })

  ipcMain.handle('get-all-currency', async (event) => {
    const currencys = await prisma.currency.findMany(); // your DB logic
    return currencys;
  })


  ipcMain.handle('get-bill-by-table', async (event, id) => {
    try {
      const currentOrder = await prisma.order.findFirst({
        where: {
          table_id: Number(id),
          is_checkout: false,
        },
        include: {
          orderItems: {
            where: {
              is_checkout: false, // Filter orderItems
            },
            include: {
              products: true, // Include related products
            },
          },
        },
      });
      return currentOrder;
    } catch (error) {
      return null
    }
  });

  ipcMain.handle('create-setting', async (event, body) => {
    await prisma.setting.create({
      data: {
        ...body
      }
    });

    return true;
  });

  ipcMain.handle('edit-setting', async (event, body) => {
    const setting = await prisma.setting.findFirst();
    delete body.id;

    await prisma.setting.update({
      where: {
        id: setting.id
      },
      data: {
        ...body
      }
    });

    return true;
  });

  ipcMain.handle('get-sell-transactions', async (event, params = {}) => {
    const { page = 1, limit = 10, keywords = "" } = params;
    const total = await prisma.order.count();
    const orders = await prisma.order.findMany({
      where: {
        ...(keywords && {
          id: {
            contains: keywords
          }
        })
      },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
      orderBy: {
        createdAt: 'desc'
      }
    });
    return {
      page: page,
      limit: limit,
      total: total,
      totalPage: Math.ceil(total / limit),
      data: orders
    };
  })

  ipcMain.handle('get-setting', async (event, body) => {
    const setting = await prisma.setting.findFirst();
    return setting;
  })


  ipcMain.handle('checkout', async (event, body) => {
    try {

      const isCheckout = body.items.some(item => item.is_checkout === false) ? false : body.is_checkout;

      if (body && body.id && body.id != '') {


        body.items.forEach(async (item) => {
          if (item.id) {
            await prisma.orderItems.update({
              where: {
                id: item.id
              },
              data: {
                product_id: item.menuItem.id,
                quantity: item.quantity,
                is_checkout: body.is_checkout ? item.is_checkout : false,
                price: item.menuItem.price * item.quantity,
              }
            });
          } else {
            await prisma.orderItems.create({
              data: {
                order_id: body.id,
                product_id: item.menuItem.id,
                menu_name: item.menuItem.name,
                quantity: item.quantity,
                is_checkout: body.is_checkout ? item.is_checkout : false,
                price: item.menuItem.price * item.quantity,
              }
            })
          }
        })

        await prisma.order.update({
          where: {
            id: body.id
          },
          data: {
            cash_recieve: {
              increment: body.cash_recieve
            }
            ,
            change: {
              increment: body.change
            },
            payment_method: body.payment_method,
            status: body.status,
            is_checkout: isCheckout,
            table: {
              connect: { id: body.table_id }, // Assuming tableNumber is a string
            }
          }
        })


        await prisma.table.update({
          where: { id: Number(body.table_id) },
          data: {
            status: isCheckout, // Mark table as available
          }
        });

      } else {
        await prisma.order.create({
          data: {
            total: body.total,
            serial: body.serial,
            tax: body.tax,
            cash_recieve: body.cash_recieve,
            subtotal: body.subtotal,
            change: body.change,
            payment_method: body.payment_method,
            status: body.status,
            is_checkout: isCheckout,
            table: {
              connect: { id: Number(body.table_id) }, // Assuming tableNumber is a string
            },
            orderItems: {
              create: body.items.map(item => ({
                quantity: item.quantity,
                is_checkout: body.is_checkout ? item.is_checkout : false,
                price: item.menuItem.price,
                menu_name: item.menuItem.name,
                products: {
                  connect: {
                    id: item.menuItem.id,
                  }
                },
                users: {
                  connect: {
                    id: body.users.id
                  }
                }
              })),
            },
          }
        });

      }


      if (body.is_checkout) {
        const saleReport = await prisma.saleReport.findFirst({
          where: {
            day: new Date().getDay(),
            month: new Date().getMonth(),
            year: new Date().getFullYear(),
          }
        })
        if (saleReport) {
          await prisma.saleReport.update({
            where: {
              id: saleReport.id,
            },
            data: {
              total_revenue: {
                increment: body.cash_recieve
              },
              total_bill: {
                increment: 1
              }
            }
          });

        } else {
          await prisma.saleReport.create({
            data: {
              total_revenue: body.total,
              total_bill: 1,
              total_cost: 0,
              total_product: 0,
              day: new Date().getDay(),
              month: new Date().getMonth(),
              year: new Date().getFullYear(),
            }
          });
        }

      }

      await prisma.table.update({
        where: { id: Number(body.table_id) },
        data: {
          status: isCheckout, // Mark table as occupied 
        }
      })
      return true;

    } catch (error) {
      console.log('error: ', error)
      return false
    }
  })

  ipcMain.handle('get-saleReport', async (event) => {
    const saleReport = await prisma.saleReport.findFirst({
      where: {
        day: new Date().getDay(),
        month: new Date().getMonth(),
        year: new Date().getFullYear(),
      }
    });

    return saleReport;
  })


  createWindow();
});

// Clean up Next.js process on exit
app.on('window-all-closed', () => {
  if (nextProcess) nextProcess.kill();
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
