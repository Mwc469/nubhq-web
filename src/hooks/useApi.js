import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/client';

// Dashboard
export function useDashboard() {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: () => api.get('/dashboard'),
  });
}

// Approvals
export function useApprovals(status = 'pending') {
  return useQuery({
    queryKey: ['approvals', status],
    queryFn: () => api.get(`/approvals?status=${status}`),
  });
}

export function useApprove() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.post(`/approvals/${id}/approve`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['approvals'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

export function useReject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.post(`/approvals/${id}/reject`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['approvals'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

// Fan Mail
export function useFanMail(unreadOnly = false) {
  return useQuery({
    queryKey: ['fan-mail', unreadOnly],
    queryFn: () => api.get(`/fan-mail${unreadOnly ? '?unread_only=true' : ''}`),
  });
}

export function useMarkAsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.patch(`/fan-mail/${id}/read`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fan-mail'] });
    },
  });
}

// Settings
export function useSettings() {
  return useQuery({
    queryKey: ['settings'],
    queryFn: () => api.get('/settings'),
  });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => api.patch('/settings', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
  });
}

// Calendar
export function useScheduledPosts(start, end) {
  const params = new URLSearchParams();
  if (start) params.append('start', start.toISOString());
  if (end) params.append('end', end.toISOString());
  const query = params.toString();

  return useQuery({
    queryKey: ['calendar', start?.toISOString(), end?.toISOString()],
    queryFn: () => api.get(`/calendar${query ? `?${query}` : ''}`),
  });
}

export function useCreateScheduledPost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => api.post('/calendar', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendar'] });
    },
  });
}

export function useUpdateScheduledPost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }) => api.patch(`/calendar/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendar'] });
    },
  });
}

export function useDeleteScheduledPost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.delete(`/calendar/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendar'] });
    },
  });
}

// AI Trainer
export function useTrainingStats() {
  return useQuery({
    queryKey: ['ai-trainer', 'stats'],
    queryFn: () => api.get('/ai-trainer/stats'),
  });
}

export function useTrainingExamples(category = null) {
  return useQuery({
    queryKey: ['ai-trainer', 'examples', category],
    queryFn: () => api.get(`/ai-trainer/examples${category ? `?category=${category}` : ''}`),
  });
}

export function useCreateTrainingExample() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => api.post('/ai-trainer/examples', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-trainer'] });
    },
  });
}

export function useDeleteTrainingExample() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.delete(`/ai-trainer/examples/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-trainer'] });
    },
  });
}
