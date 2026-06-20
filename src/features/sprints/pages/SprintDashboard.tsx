import { useState } from 'react';
import { Target, Plus, Activity, Trash2, PauseCircle, PlayCircle, CheckCircle2, X, Edit2 } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { useSprints } from '../hooks/useSprints';
import { sprintsService } from '../services/sprints.service';
import { useCategories } from '../../../hooks/useCategories';
import type { Sprint, SprintType, SprintMetric } from '../../../types';
import { cn } from '../../../lib/utils';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import { DatePicker } from '../../../components/ui/DatePicker';
import { getCategoryColor } from '../../../lib/colors';
import { getLocalYYYYMMDD } from '../../../lib/date';
import { SprintEducationCard } from '../components/SprintEducationCard';
export function SprintDashboard() {
  const { sprints, loading, error } = useSprints();
  const { categories, loading: catsLoading } = useCategories();
  
  const todayStr = getLocalYYYYMMDD(new Date());
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = getLocalYYYYMMDD(tomorrow);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
    sprintType: 'course' as SprintType,
    metric: 'hours' as SprintMetric,
    targetValue: 10 as number | '',
    targetDate: tomorrowStr
  });

  const activeSprints = sprints.filter(s => s.status === 'active' || s.status === 'paused');
  const pastSprints = sprints.filter(s => s.status === 'completed' || s.status === 'failed');

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = 'Sprint name is required';
    if (!formData.categoryId) errors.categoryId = 'Category is required';
    if (formData.targetValue === '' || isNaN(formData.targetValue as number) || (formData.targetValue as number) <= 0) {
      errors.targetValue = 'Target must be a positive number';
    }
    if (!formData.targetDate) {
      errors.targetDate = 'Target date is required';
    } else if (formData.targetDate < todayStr) {
      errors.targetDate = 'Target date cannot be in the past';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateOrUpdate = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      if (editingId) {
        await sprintsService.updateSprint(editingId, {
          name: formData.name,
          categoryId: formData.categoryId,
          sprintType: formData.sprintType,
          metric: formData.metric,
          targetValue: Number(formData.targetValue),
          targetDate: new Date(formData.targetDate).getTime(),
        });
      } else {
        await sprintsService.createSprint({
          name: formData.name,
          categoryId: formData.categoryId,
          sprintType: formData.sprintType,
          metric: formData.metric,
          targetValue: Number(formData.targetValue),
          initialValue: 0,
          targetDate: new Date(formData.targetDate).getTime(),
          startDate: Date.now(),
          status: 'active'
        });
      }
      
      closeModal();
    } catch (e: any) {
      setFormErrors({ submit: e.message || 'Failed to save sprint' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    setIsCreateModalOpen(false);
    setEditingId(null);
    setFormErrors({});
    setFormData({
      name: '',
      categoryId: '',
      sprintType: 'course',
      metric: 'hours',
      targetValue: 10,
      targetDate: tomorrowStr
    });
  };

  const handleEdit = (sprint: Sprint) => {
    setFormData({
      name: sprint.name,
      categoryId: sprint.categoryId,
      sprintType: sprint.sprintType,
      metric: sprint.metric,
      targetValue: sprint.targetValue,
      targetDate: getLocalYYYYMMDD(new Date(sprint.targetDate))
    });
    setEditingId(sprint.id);
    setFormErrors({});
    setIsCreateModalOpen(true);
  };

  const updateStatus = async (id: string, status: Sprint['status']) => {
    try {
      await sprintsService.updateSprint(id, { status });
    } catch (e: any) {
      alert(e.message);
    }
  };

  const deleteSprint = async (id: string) => {
    if (confirm('Are you sure you want to delete this sprint?')) {
      await sprintsService.deleteSprint(id);
    }
  };

  if (loading || catsLoading) return <div className="p-12 flex justify-center"><LoadingSpinner /></div>;
  if (error) {
    return (
      <div className="p-12">
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6 text-center max-w-2xl mx-auto">
          <h3 className="text-xl font-bold text-red-500 mb-2">Error Loading Sprints</h3>
          <p className="text-red-500/80">{error}</p>
          <p className="text-sm mt-4 text-muted-foreground">This might happen if a Firestore index is missing. Please check your Firebase console or contact support.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Sprint Zone</h2>
          <p className="text-muted-foreground mt-1">Accelerate your progress with focused, time-bound goals.</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)} className="w-full sm:w-auto shadow-md hover:shadow-lg transition-all">
          <Plus className="mr-2 h-5 w-5" />
          Create Sprint
        </Button>
      </div>

      <SprintEducationCard />

      {activeSprints.length === 0 && pastSprints.length === 0 && (
        <div className="text-center py-16 text-muted-foreground border rounded-xl border-dashed bg-card/50 flex flex-col items-center justify-center shadow-inner mt-4">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Target className="h-8 w-8 text-primary opacity-80" />
          </div>
          <p className="text-2xl font-bold text-foreground mb-2">No Active Sprints</p>
          <p className="mt-1 text-base max-w-lg mb-6">Sprints are short, focused challenges that help you learn faster. Pick a goal, set a deadline, and track your daily progress!</p>
          <Button onClick={() => setIsCreateModalOpen(true)} size="lg" className="shadow-md">
            Launch Your First Sprint
          </Button>
        </div>
      )}

      {activeSprints.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-500" /> Active & Paused Sprints
          </h3>
          <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {activeSprints.map(sprint => (
              <SprintCard 
                key={sprint.id} 
                sprint={sprint} 
                category={categories.find(c => c.id === sprint.categoryId)} 
                onUpdateStatus={(status) => updateStatus(sprint.id, status)}
                onDelete={() => deleteSprint(sprint.id)}
                onEdit={() => handleEdit(sprint)}
              />
            ))}
          </div>
        </div>
      )}

      {pastSprints.length > 0 && (
        <div className="space-y-4 pt-8 border-t border-border/50">
          <h3 className="text-xl font-bold text-muted-foreground">Past Sprints</h3>
          <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3 opacity-80">
            {pastSprints.map(sprint => (
              <SprintCard 
                key={sprint.id} 
                sprint={sprint} 
                category={categories.find(c => c.id === sprint.categoryId)} 
                onUpdateStatus={(status) => updateStatus(sprint.id, status)}
                onDelete={() => deleteSprint(sprint.id)}
                onEdit={() => {}}
              />
            ))}
          </div>
        </div>
      )}

      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-background/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-card w-full max-w-4xl rounded-xl shadow-2xl border flex overflow-hidden max-h-[90vh]">
            
            {/* Form Section */}
            <div className="flex-1 p-6 overflow-y-auto border-r border-border/50">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold tracking-tight">{editingId ? 'Edit Sprint' : 'Create New Sprint'}</h2>
                <button onClick={closeModal} className="p-1 hover:bg-accent rounded-md lg:hidden">
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              {formErrors.submit && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-md text-sm">
                  {formErrors.submit}
                </div>
              )}

              <div className="space-y-6">
                {/* Section 1: Goal Definition */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-primary uppercase tracking-wider border-b pb-2">1. Goal Definition</h3>
                  <div>
                    <label className="block text-sm font-medium mb-1">Sprint Name</label>
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      onBlur={() => setFormData({...formData, name: formData.name.trim()})}
                      className={cn("w-full p-2 bg-background border rounded-md focus:ring-2 focus:ring-primary", formErrors.name ? "border-red-500" : "border-input")}
                      placeholder="e.g. Pass AWS Cloud Practitioner"
                    />
                    {formErrors.name && <p className="text-xs text-red-500 mt-1">{formErrors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Category</label>
                    <select 
                      value={formData.categoryId}
                      onChange={e => setFormData({...formData, categoryId: e.target.value})}
                      className={cn("w-full p-2 bg-background border rounded-md focus:ring-2 focus:ring-primary", formErrors.categoryId ? "border-red-500" : "border-input")}
                    >
                      <option value="">Select a Category...</option>
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                    {formErrors.categoryId && <p className="text-xs text-red-500 mt-1">{formErrors.categoryId}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Goal Type</label>
                    <select 
                      value={formData.sprintType}
                      onChange={e => setFormData({...formData, sprintType: e.target.value as SprintType})}
                      className="w-full p-2 bg-background border border-input rounded-md capitalize focus:ring-2 focus:ring-primary"
                    >
                      <option value="course">Course</option>
                      <option value="certification">Certification</option>
                      <option value="exam">Exam</option>
                      <option value="project">Project</option>
                      <option value="custom">Custom</option>
                    </select>
                  </div>
                </div>

                {/* Section 2: Measurement */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-primary uppercase tracking-wider border-b pb-2">2. Measurement</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Track By</label>
                      <select 
                        value={formData.metric}
                        onChange={e => setFormData({...formData, metric: e.target.value as SprintMetric})}
                        className="w-full p-2 bg-background border border-input rounded-md capitalize focus:ring-2 focus:ring-primary"
                      >
                        <option value="hours">Hours Focused</option>
                        <option value="cards">Cards Mastered</option>
                        <option value="tasks">Tasks Completed</option>
                      </select>
                      <p className="text-xs text-muted-foreground mt-1">How will you measure success?</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Target ({formData.metric})</label>
                      <input 
                        type="number" 
                        min="1"
                        value={formData.targetValue}
                        onChange={e => setFormData({...formData, targetValue: e.target.value === '' ? '' : Number(e.target.value)})}
                        className={cn("w-full p-2 bg-background border rounded-md focus:ring-2 focus:ring-primary", formErrors.targetValue ? "border-red-500" : "border-input")}
                      />
                      {formErrors.targetValue && <p className="text-xs text-red-500 mt-1">{formErrors.targetValue}</p>}
                    </div>
                  </div>
                </div>

                {/* Section 3: Timeline */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-primary uppercase tracking-wider border-b pb-2">3. Timeline</h3>
                  <div>
                    <label className="block text-sm font-medium mb-1">Target Date (Deadline)</label>
                    <DatePicker
                      value={formData.targetDate}
                      onChange={(date) => setFormData({...formData, targetDate: date})}
                      minDate={todayStr}
                    />
                    {formErrors.targetDate && <p className="text-xs text-red-500 mt-1">{formErrors.targetDate}</p>}
                  </div>
                </div>

                <div className="pt-4 flex justify-end gap-3 lg:hidden">
                  <Button variant="outline" onClick={closeModal} disabled={isSubmitting}>Cancel</Button>
                  <Button onClick={handleCreateOrUpdate} disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : (editingId ? 'Save Changes' : 'Launch Sprint')}
                  </Button>
                </div>
              </div>
            </div>

            {/* Preview Section */}
            <div className="hidden lg:flex w-80 bg-muted/20 p-6 flex-col relative">
              <button onClick={closeModal} className="absolute top-4 right-4 p-1 hover:bg-accent rounded-md text-muted-foreground">
                <X className="h-5 w-5" />
              </button>
              
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" /> Live Preview
              </h3>

              <div className="bg-card border rounded-xl shadow-sm p-5 flex flex-col gap-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary mb-2 inline-block">
                    {editingId ? 'Edit Preview' : 'New Sprint'}
                  </span>
                  <h4 className="text-lg font-bold leading-tight break-words">{formData.name || 'Untitled Sprint'}</h4>
                  {formData.categoryId && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-2">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: getCategoryColor(categories.find(c => c.id === formData.categoryId)?.color) }} />
                      {categories.find(c => c.id === formData.categoryId)?.name}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 border-t pt-4">
                  <div>
                    <span className="text-xs text-muted-foreground font-semibold uppercase block mb-1">Total Goal</span>
                    <span className="text-lg font-bold">{formData.targetValue || '—'}</span>
                    <span className="text-xs text-muted-foreground ml-1 capitalize">{formData.metric}</span>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground font-semibold uppercase block mb-1">Deadline</span>
                    <span className="text-lg font-bold">
                      {Math.max(1, Math.ceil((new Date(formData.targetDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))}
                    </span>
                    <span className="text-xs text-muted-foreground ml-1">Days</span>
                  </div>
                </div>

                <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 text-center mt-2">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-widest block mb-1">Required Pace</span>
                  <span className="text-xl font-black text-foreground">
                    {formData.targetValue && formData.targetDate ? 
                      (Number(formData.targetValue) / Math.max(1, Math.ceil((new Date(formData.targetDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))).toFixed(1)
                      : '—'}
                  </span>
                  <span className="text-xs font-medium text-muted-foreground ml-1 capitalize">{formData.metric} / Day</span>
                </div>
              </div>

              <div className="mt-auto pt-6 flex flex-col gap-3">
                <Button onClick={handleCreateOrUpdate} disabled={isSubmitting} size="lg" className="w-full shadow-md">
                  {isSubmitting ? 'Saving...' : (editingId ? 'Save Changes' : 'Launch Sprint')}
                </Button>
                <Button variant="ghost" onClick={closeModal} disabled={isSubmitting} className="w-full">
                  Cancel
                </Button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

function SprintCard({ sprint, category, onUpdateStatus, onDelete, onEdit }: { sprint: Sprint, category?: any, onUpdateStatus: (status: Sprint['status']) => void, onDelete: () => void, onEdit: () => void }) {
  const isPast = sprint.status === 'completed' || sprint.status === 'failed';
  
  const totalTarget = sprint.targetValue;
  const current = sprint.currentValue;
  const progressPercent = Math.min(100, Math.max(0, Math.round(((current - sprint.initialValue) / totalTarget) * 100)));
  
  const now = Date.now();
  const daysRemaining = Math.max(0, Math.ceil((sprint.targetDate - now) / (1000 * 60 * 60 * 24)));
  const sprintDaysElapsed = Math.max(1, Math.ceil((now - sprint.startDate) / (1000 * 60 * 60 * 24)));
  
  // Calculate 7-day rolling velocity
  const last7Days: string[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(now - (i * 24 * 60 * 60 * 1000));
    last7Days.push(getLocalYYYYMMDD(d));
  }
  
  let recentProgress = 0;
  if (sprint.progressMap) {
    last7Days.forEach(day => {
      recentProgress += (sprint.progressMap![day] || 0);
    });
  }
  
  const daysToDivide = Math.min(7, sprintDaysElapsed);
  const velocityPerDay = sprint.progressMap ? (recentProgress / daysToDivide) : ((current - sprint.initialValue) / sprintDaysElapsed);
  
  const remainingValue = Math.max(0, totalTarget - (current - sprint.initialValue));
  const requiredPace = daysRemaining > 0 ? remainingValue / daysRemaining : remainingValue;
  
  // Health Status
  let health: 'on_track' | 'slightly_behind' | 'at_risk' = 'on_track';
  if (velocityPerDay >= requiredPace || remainingValue <= 0) {
    health = 'on_track';
  } else if (velocityPerDay >= requiredPace * 0.7) {
    health = 'slightly_behind';
  } else {
    health = 'at_risk';
  }

  let predictedDateStr = 'On Track';
  if (remainingValue <= 0) {
    predictedDateStr = 'Completed';
  } else if (velocityPerDay > 0) {
    const daysToFinish = Math.ceil(remainingValue / velocityPerDay);
    const predictedTime = now + (daysToFinish * 24 * 60 * 60 * 1000);
    if (predictedTime > sprint.targetDate) {
      predictedDateStr = getLocalYYYYMMDD(new Date(predictedTime));
    }
  } else {
    predictedDateStr = 'Stalled';
  }

  const formatMetric = (val: number) => sprint.metric === 'hours' ? `${val.toFixed(1)}h` : `${Math.ceil(val)} ${sprint.metric === 'cards' ? 'cards' : 'tasks'}`;

  return (
    <div className={cn(
      "bg-card border rounded-xl shadow-sm p-5 relative overflow-hidden flex flex-col transition-all hover:shadow-md",
      sprint.status === 'paused' && "opacity-75"
    )}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={cn(
              "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1",
              isPast ? (sprint.status === 'completed' ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500") :
              health === 'on_track' ? "bg-green-500/10 text-green-500" :
              health === 'slightly_behind' ? "bg-yellow-500/10 text-yellow-500" :
              "bg-red-500/10 text-red-500"
            )}>
              {!isPast && (
                <span className={cn(
                  "w-1.5 h-1.5 rounded-full animate-pulse",
                  health === 'on_track' ? "bg-green-500" :
                  health === 'slightly_behind' ? "bg-yellow-500" : "bg-red-500"
                )} />
              )}
              {isPast ? sprint.status : (health === 'on_track' ? 'On Track' : health === 'slightly_behind' ? 'Slightly Behind' : 'At Risk')}
            </span>
            <span className="text-[10px] font-medium text-muted-foreground border px-2 py-0.5 rounded-full capitalize">
              {sprint.sprintType}
            </span>
          </div>
          <h4 className="text-lg font-bold mt-1 line-clamp-1" title={sprint.name}>{sprint.name}</h4>
          {category && (
            <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: getCategoryColor(category.color) }} />
              {category.name}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-y-4 gap-x-2 mt-auto border-t pt-4">
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground font-semibold uppercase">Progress</span>
          <span className="text-lg font-bold">{progressPercent}%</span>
          <span className="text-[10px] text-muted-foreground mt-0.5">{Number(current - sprint.initialValue).toFixed(sprint.metric === 'hours' ? 1 : 0)} / {totalTarget} {sprint.metric}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground font-semibold uppercase">Days Left</span>
          <span className="text-lg font-bold">{daysRemaining}</span>
          <span className="text-[10px] text-muted-foreground mt-0.5">Predicted: {predictedDateStr}</span>
        </div>
        {!isPast && (
          <>
            <div className="flex flex-col bg-muted/30 p-2 rounded-lg">
              <span className="text-[10px] text-muted-foreground font-semibold uppercase">Current Pace</span>
              <span className="text-sm font-bold">{formatMetric(velocityPerDay)} / day</span>
            </div>
            <div className="flex flex-col bg-muted/30 p-2 rounded-lg">
              <span className="text-[10px] text-muted-foreground font-semibold uppercase">Required Pace</span>
              <span className="text-sm font-bold">{formatMetric(requiredPace)} / day</span>
            </div>
          </>
        )}
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-muted rounded-full h-1.5 mt-4 overflow-hidden relative">
        <div 
          className={cn("h-full transition-all duration-500", 
            isPast ? (sprint.status === 'completed' ? 'bg-green-500' : 'bg-muted-foreground') :
            health === 'on_track' ? 'bg-green-500' :
            health === 'slightly_behind' ? 'bg-yellow-500' : 'bg-red-500'
          )} 
          style={{ width: `${progressPercent}%` }} 
        />
      </div>

      <div className="flex justify-end gap-2 mt-4">
        {sprint.status === 'active' && (
          <Button variant="outline" size="sm" onClick={() => onUpdateStatus('paused')}>
            <PauseCircle className="h-4 w-4 mr-1" /> Pause
          </Button>
        )}
        {sprint.status === 'paused' && (
          <Button variant="outline" size="sm" onClick={() => onUpdateStatus('active')}>
            <PlayCircle className="h-4 w-4 mr-1" /> Resume
          </Button>
        )}
        {(sprint.status === 'active' || sprint.status === 'paused') && (
          <>
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Edit2 className="h-4 w-4 mr-1" /> Edit
            </Button>
            <Button variant="outline" size="sm" className="text-green-500 hover:text-green-600 hover:bg-green-500/10" onClick={() => onUpdateStatus('completed')}>
              <CheckCircle2 className="h-4 w-4 mr-1" /> Done
            </Button>
          </>
        )}
        <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10 px-2" onClick={onDelete}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
