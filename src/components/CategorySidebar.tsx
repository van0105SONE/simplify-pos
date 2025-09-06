import React from 'react';
import { Button } from '@/components/ui/button';
import { Category } from '@/types/pos';
import { cn } from '@/lib/utils';

interface CategorySidebarProps {
  categories: Category[];
  selectedCategory: string;
  onCategorySelect: (categoryId: string) => void;
  className?: string;
}

export const CategorySidebar: React.FC<CategorySidebarProps> = ({
  categories,
  selectedCategory,
  onCategorySelect,
  className,
}) => {
  return (
    <div className={cn("flex flex-col gap-2 p-4", className)}>
      <h2 className="text-lg font-semibold text-foreground mb-2">Categories</h2>
      
      {categories.map((category) => (
        <Button
          key={category.id}
          variant={selectedCategory === category.id ? "outline" : "secondary"}
          onClick={() => onCategorySelect(category.id)}
          className="justify-start gap-3 min-h-[60px] text-left"
        >
          <span className="text-2xl">{category.icon}</span>
          <div className="flex flex-col items-start">
            <span className="font-medium">{category.name}</span>
          </div>
        </Button>
      ))}
    </div>
  );
};