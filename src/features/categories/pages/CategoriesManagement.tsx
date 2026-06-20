import { useState } from 'react';
import { Plus, Edit2, Trash2, Layers, AlertCircle } from 'lucide-react';
import { useCategories } from '../../../hooks/useCategories';
import { useAuth } from '../../../hooks/useAuth';
import { useDemo } from '../../../contexts/DemoContext';
import { categoriesService } from '../services/categories.service';
import { CategoryFormDialog } from '../components/CategoryFormDialog';
import { Button } from '../../../components/ui/Button';
import { Card, CardContent } from '../../../components/ui/Card';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import type { Category } from '../../../types';

export function CategoriesManagement() {
  const { categories, loading } = useCategories();
  const activeCategories = categories.filter(c => !c.isArchived);
  const { user } = useAuth();
  const { isDemo } = useDemo();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | undefined>(undefined);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleOpenAdd = () => {
    setEditingCategory(undefined);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (category: Category) => {
    setEditingCategory(category);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to archive this category?\n\nIt will be hidden from active menus, but your historical study analytics and notes will be preserved."
    );
    
    if (isConfirmed) {
      try {
        setIsDeleting(id);
        await categoriesService.archiveCategory(id);
      } catch (err) {
        console.error("Failed to delete category:", err);
        alert("An error occurred while deleting the category.");
      } finally {
        setIsDeleting(null);
      }
    }
  };

  const handleSubmit = async (data: { name: string; color: string; targetMinutes: number }) => {
    if (!user) return;
    
    if (editingCategory) {
      await categoriesService.updateCategory(editingCategory.id, data);
    } else {
      await categoriesService.createCategory({
        ...data,
        userId: user.uid
      });
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Category Management</h2>
          <p className="text-muted-foreground mt-1">
            Create, edit, and organize your learning workspaces.
          </p>
        </div>
        <Button 
          onClick={handleOpenAdd} 
          className="shrink-0 flex items-center gap-2"
          disabled={isDemo}
          title={isDemo ? "Disabled in Demo Mode" : undefined}
        >
          <Plus className="h-4 w-4" />
          Add Category
        </Button>
      </div>

      <div className="bg-info/10 border border-info/20 text-info p-4 rounded-lg flex gap-3 text-sm">
        <AlertCircle className="h-5 w-5 shrink-0" />
        <p>
          Archiving a category safely hides it from new study sessions, while preserving your past analytics, notes, and study history.
        </p>
      </div>

      {loading ? (
        <div className="py-12 flex justify-center">
          <LoadingSpinner />
        </div>
      ) : activeCategories.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground italic border rounded-xl border-dashed bg-card/50">
          <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
            <Layers className="h-6 w-6 opacity-50" />
          </div>
          <p>No categories defined.</p>
          <p className="text-sm mt-1">Click 'Add Category' to create your first workspace.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {activeCategories.map((cat) => (
            <Card key={cat.id} className="relative overflow-hidden group">
              <div 
                className="absolute top-0 left-0 bottom-0 w-2"
                style={{ backgroundColor: cat.color }}
              />
              <CardContent className="p-5 pl-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg leading-none">{cat.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1 font-medium">
                      Target: {cat.targetMinutes} mins/day
                    </p>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleOpenEdit(cat)}
                      className="p-1.5 hover:bg-accent rounded-md text-muted-foreground transition-colors disabled:opacity-50"
                      disabled={isDeleting === cat.id || isDemo}
                      title={isDemo ? "Disabled in Demo Mode" : "Edit category"}
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="p-1.5 hover:bg-destructive/10 rounded-md text-destructive transition-colors disabled:opacity-50"
                      disabled={isDeleting === cat.id || isDemo}
                      title={isDemo ? "Disabled in Demo Mode" : "Archive category"}
                    >
                      {isDeleting === cat.id ? (
                        <LoadingSpinner className="h-4 w-4" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <CategoryFormDialog 
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleSubmit}
        initialData={editingCategory}
      />
    </div>
  );
}
