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
