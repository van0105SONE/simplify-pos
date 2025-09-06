declare global {
  interface Window {
    electronAPI: {
      print: () => void;
      printRaw: (text: string) => void;
    };
  }
}
