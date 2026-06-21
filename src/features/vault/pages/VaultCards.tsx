import { useState, useMemo } from 'react';
import { Plus, Search, Filter, FileText } from 'lucide-react';
import { Card, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { MasteryLevelBadge } from '../components/MasteryLevelBadge';
import { MOCK_QUESTIONS, MOCK_CATEGORIES, MASTERY_LEVELS } from '../utils/vaultHelpers';
import { cn } from '../../../lib/utils';

type StatusFilter = 'all' | 'new' | 'learning' | 'improving' | 'strong' | 'mastered';

export function VaultCards() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const filteredCards = useMemo(() => {
    let result = MOCK_QUESTIONS;

    // Status filter (maps to mastery levels)
    if (statusFilter !== 'all') {
      const level = MASTERY_LEVELS.find(l => l.level === statusFilter);
      if (level) {
        result = result.filter(q => {
          const score = q.masteryScore || 0;
          const isNew = score === 0 && (q.reviewCount || 0) === 0;
          if (statusFilter === 'new') return isNew;
          return !isNew && score >= level.min && score <= level.max;
        });
      }
    }

    // Category filter
    if (categoryFilter !== 'all') {
      result = result.filter(q => q.categoryId === categoryFilter);
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(q =>
        q.question.toLowerCase().includes(query) ||
        q.answer.toLowerCase().includes(query)
      );
    }

    return result;
  }, [searchQuery, statusFilter, categoryFilter]);

  const getCategoryName = (id: string) => MOCK_CATEGORIES.find(c => c.id === id)?.name || 'Unknown';

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">All Cards</h2>
          <p className="text-muted-foreground mt-1">
            {filteredCards.length} of {MOCK_QUESTIONS.length} cards
          </p>
        </div>
        <Button className="shrink-0 flex items-center gap-2">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Create Card</span>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search cards..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-sm bg-background border border-input rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Categories</option>
            {MOCK_CATEGORIES.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap border-b border-border gap-1">
        {(['all', 'new', 'learning', 'improving', 'strong', 'mastered'] as StatusFilter[]).map((f) => {
          const level = MASTERY_LEVELS.find(l => l.level === f);
          return (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={cn(
                'px-3 py-2 text-sm font-medium capitalize transition-colors rounded-t-md',
                statusFilter === f
                  ? 'border-b-2 border-primary text-primary bg-primary/5'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/30'
              )}
            >
              {f === 'all' ? 'All' : level?.label || f}
            </button>
          );
        })}
      </div>

      {/* Card List */}
      {filteredCards.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground italic border rounded-xl border-dashed bg-card/50 flex flex-col items-center justify-center">
          <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
            <Search className="h-6 w-6 opacity-50" />
          </div>
          <p>No cards found matching your filters.</p>
          <p className="text-sm mt-1">Try adjusting your search or filter criteria.</p>
        </div>
      ) : (
        <div className="grid gap-3 max-w-4xl">
          {filteredCards.map(card => (
            <Card key={card.id} className="group hover:border-primary/30 transition-all">
              <CardContent className="p-4 sm:p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    {/* Question */}
                    <h3 className="font-semibold text-base leading-snug group-hover:text-primary transition-colors">
                      {card.question}
                    </h3>

                    {/* Metadata Row */}
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <MasteryLevelBadge score={card.masteryScore || 0} reviewCount={card.reviewCount} />
                      <span className="text-xs text-muted-foreground border border-border/50 px-2 py-0.5 rounded bg-muted/20 capitalize">
                        {card.type?.replace('_', ' ') || 'concept review'}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {getCategoryName(card.categoryId)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        • {card.reviewCount || 0} reviews
                      </span>
                    </div>

                    {/* Source Context (PDF integration point) */}
                    {card.sourceResourceTitle && (
                      <div className="mt-2 text-xs bg-muted/40 p-2 rounded border-l-2 border-primary/50 text-muted-foreground line-clamp-1 italic flex items-center gap-1.5">
                        <FileText className="h-3 w-3 shrink-0" />
                        From: {card.sourceResourceTitle}
                        {card.sourcePageNumber && ` (Page ${card.sourcePageNumber})`}
                      </div>
                    )}
                  </div>

                  {/* Mastery Score */}
                  <div className="shrink-0 text-right">
                    <div className="text-xl font-bold font-mono">{card.masteryScore || 0}%</div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider">mastery</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
