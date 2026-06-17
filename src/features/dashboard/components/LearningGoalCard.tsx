import React from 'react';
import { Target } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import { useAuth } from '../../../hooks/useAuth';

export const LearningGoalCard: React.FC = () => {
  const { user } = useAuth();

  return (
    <Card className="bg-primary/5 border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-primary flex items-center gap-2 uppercase tracking-wider">
          <Target className="h-4 w-4" />
          Primary Objective
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold leading-tight">
          {user?.learningGoal || 'Define your learning goal in Settings'}
        </p>
      </CardContent>
    </Card>
  );
};
