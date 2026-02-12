import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Announcement, CreateAnnouncementRequest, UpdateAnnouncementRequest } from '@/types';
import { announcementsApi } from '@/api/announcements';

interface AnnouncementState {
  announcements: Announcement[];
  selectedAnnouncement: Announcement | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchAnnouncements: () => Promise<void>;
  getAnnouncementById: (id: number) => Announcement | undefined;
  createAnnouncement: (data: CreateAnnouncementRequest, createdBy: number, createdByName: string, createdByRole: any) => Promise<void>;
  updateAnnouncement: (id: number, data: UpdateAnnouncementRequest) => Promise<void>;
  deleteAnnouncement: (id: number) => Promise<void>;
  setSelectedAnnouncement: (announcement: Announcement | null) => void;
}

export const useAnnouncementStore = create<AnnouncementState>()(
  persist(
    (set, get) => ({
      announcements: [],
      selectedAnnouncement: null,
      isLoading: false,
      error: null,

      fetchAnnouncements: async () => {
        set({ isLoading: true, error: null });
        try {
          // Fetch from real API
          const announcements = await announcementsApi.getAll();
          
          // Filter active announcements
          const activeAnnouncements = announcements.filter(
            (a: Announcement) => a.status === 'ACTIVE' && (!a.expiresAt || new Date(a.expiresAt) > new Date())
          );
          
          set({ announcements: activeAnnouncements, isLoading: false });
        } catch (error) {
          console.error('Failed to fetch announcements:', error);
          set({ error: 'Failed to fetch announcements', isLoading: false });
        }
      },

      getAnnouncementById: (id: number) => {
        return get().announcements.find((a) => a.id === id);
      },

      createAnnouncement: async (
        data: CreateAnnouncementRequest,
        createdBy: number,
        createdByName: string,
        createdByRole: any
      ) => {
        set({ isLoading: true, error: null });
        try {
          const newAnnouncement = await announcementsApi.create({
            title: data.title,
            content: data.description || data.content,
            priority: data.priority,
          });

          set((state) => ({
            announcements: [newAnnouncement, ...state.announcements],
            isLoading: false,
          }));
        } catch (error) {
          console.error('Failed to create announcement:', error);
          set({ error: 'Failed to create announcement', isLoading: false });
        }
      },

      updateAnnouncement: async (id: number, data: UpdateAnnouncementRequest) => {
        set({ isLoading: true, error: null });
        try {
          const updatedAnnouncement = await announcementsApi.update(id.toString(), data);
          
          set((state) => ({
            announcements: state.announcements.map((a) =>
              a.id === id ? updatedAnnouncement : a
            ),
            isLoading: false,
          }));
        } catch (error) {
          console.error('Failed to update announcement:', error);
          set({ error: 'Failed to update announcement', isLoading: false });
        }
      },

      deleteAnnouncement: async (id: number) => {
        set({ isLoading: true, error: null });
        try {
          await announcementsApi.delete(id.toString());
          
          set((state) => ({
            announcements: state.announcements.filter((a) => a.id !== id),
            isLoading: false,
          }));
        } catch (error) {
          console.error('Failed to delete announcement:', error);
          set({ error: 'Failed to delete announcement', isLoading: false });
        }
      },

      setSelectedAnnouncement: (announcement: Announcement | null) => {
        set({ selectedAnnouncement: announcement });
      },
    }),
    {
      name: 'announcement-store',
    }
  )
);
