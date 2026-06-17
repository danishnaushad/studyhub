import { Layers } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import { useCategories } from '../../../hooks/useCategories';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';

export function CategoriesCard() {
  const { categories, loading } = useCategories();

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2 uppercase tracking-wider">
          <Layers className="h-4 w-4" />
          My Categories
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center p-4"><LoadingSpinner /></div>
        ) : categories.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <span 
                key={cat.id} 
                className="px-3 py-1 rounded-full text-sm font-medium text-white"
                style={{ backgroundColor: cat.color }}
              >
                {cat.name}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No categories defined yet.</p>
        )}
      </CardContent>
    </Card>
  );
}
