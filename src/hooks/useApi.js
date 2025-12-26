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

export function useReplyToMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reply }) => api.post(`/fan-mail/${id}/reply`, { reply }),
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

// Posts
export function usePosts(status = null, platform = null) {
  const params = new URLSearchParams();
  if (status) params.append('status', status);
  if (platform) params.append('platform', platform);
  const query = params.toString();

  return useQuery({
    queryKey: ['posts', status, platform],
    queryFn: () => api.get(`/posts${query ? `?${query}` : ''}`),
  });
}

export function usePost(id) {
  return useQuery({
    queryKey: ['posts', id],
    queryFn: () => api.get(`/posts/${id}`),
    enabled: !!id,
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => api.post('/posts', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['calendar'] });
    },
  });
}

export function useUpdatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }) => api.patch(`/posts/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.delete(`/posts/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}

export function usePublishPost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.post(`/posts/${id}/publish`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}

// Templates
export function useTemplates(category = null, favoritesOnly = false) {
  const params = new URLSearchParams();
  if (category) params.append('category', category);
  if (favoritesOnly) params.append('favorites_only', 'true');
  const query = params.toString();

  return useQuery({
    queryKey: ['templates', category, favoritesOnly],
    queryFn: () => api.get(`/templates${query ? `?${query}` : ''}`),
  });
}

export function useCreateTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => api.post('/templates', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
    },
  });
}

export function useUpdateTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }) => api.patch(`/templates/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
    },
  });
}

export function useDeleteTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.delete(`/templates/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
    },
  });
}

export function useToggleTemplateFavorite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.post(`/templates/${id}/favorite`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
    },
  });
}

export function useUseTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.post(`/templates/${id}/use`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
    },
  });
}

// Analytics
export function useAnalyticsOverview(period = '30d') {
  return useQuery({
    queryKey: ['analytics', 'overview', period],
    queryFn: () => api.get(`/analytics/overview?period=${period}`),
  });
}

export function useEngagementData(period = '7d') {
  return useQuery({
    queryKey: ['analytics', 'engagement', period],
    queryFn: () => api.get(`/analytics/engagement?period=${period}`),
  });
}

export function useRevenueData(period = '6m') {
  return useQuery({
    queryKey: ['analytics', 'revenue', period],
    queryFn: () => api.get(`/analytics/revenue?period=${period}`),
  });
}

export function usePlatformDistribution() {
  return useQuery({
    queryKey: ['analytics', 'platforms'],
    queryFn: () => api.get('/analytics/platforms'),
  });
}

export function useTopPosts(limit = 5) {
  return useQuery({
    queryKey: ['analytics', 'top-posts', limit],
    queryFn: () => api.get(`/analytics/top-posts?limit=${limit}`),
  });
}

export function useDemographics() {
  return useQuery({
    queryKey: ['analytics', 'demographics'],
    queryFn: () => api.get('/analytics/demographics'),
  });
}

// Activity
export function useActivityLog(activityType = null, limit = 20, offset = 0) {
  const params = new URLSearchParams();
  if (activityType) params.append('activity_type', activityType);
  params.append('limit', limit.toString());
  params.append('offset', offset.toString());
  const query = params.toString();

  return useQuery({
    queryKey: ['activity', activityType, limit, offset],
    queryFn: () => api.get(`/activity?${query}`),
  });
}

export function useActivityStats() {
  return useQuery({
    queryKey: ['activity', 'stats'],
    queryFn: () => api.get('/activity/stats'),
  });
}

export function useRecentActivity(limit = 5) {
  return useQuery({
    queryKey: ['activity', 'recent', limit],
    queryFn: () => api.get(`/activity/recent?limit=${limit}`),
  });
}

// Email Campaigns
export function useEmailStats() {
  return useQuery({
    queryKey: ['email-campaigns', 'stats'],
    queryFn: () => api.get('/email-campaigns/stats'),
  });
}

export function useEmailCampaigns(status = null) {
  const query = status ? `?status=${status}` : '';
  return useQuery({
    queryKey: ['email-campaigns', status],
    queryFn: () => api.get(`/email-campaigns${query}`),
  });
}

export function useCreateEmailCampaign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => api.post('/email-campaigns', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-campaigns'] });
    },
  });
}

export function useUpdateEmailCampaign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }) => api.patch(`/email-campaigns/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-campaigns'] });
    },
  });
}

export function useDeleteEmailCampaign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.delete(`/email-campaigns/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-campaigns'] });
    },
  });
}

export function useSendEmailCampaign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.post(`/email-campaigns/${id}/send`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-campaigns'] });
    },
  });
}

// Media
export function useMedia(mediaType = null) {
  const query = mediaType ? `?media_type=${mediaType}` : '';
  return useQuery({
    queryKey: ['media', mediaType],
    queryFn: () => api.get(`/media${query}`),
  });
}

export function useMediaStats() {
  return useQuery({
    queryKey: ['media', 'stats'],
    queryFn: () => api.get('/media/stats'),
  });
}

export function useUploadMedia() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => api.post('/media', null, { params: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media'] });
    },
  });
}

export function useDeleteMedia() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.delete(`/media/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media'] });
    },
  });
}
