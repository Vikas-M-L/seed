import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Announcement, CreateAnnouncementRequest, UpdateAnnouncementRequest } from '@/types';
import { mockAnnouncements } from '@/services/mockData';

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

let announcementIdCounter = 5;

export const useAnnouncementStore = create<AnnouncementState>()(
  persist(
    (set, get) => ({
      announcements: mockAnnouncements,
      selectedAnnouncement: null,
      isLoading: false,
      error: null,

      fetchAnnouncements: async () => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 500));
          
          // Filter active announcements
          const activeAnnouncements = get().announcements.filter(
            (a) => a.status === 'ACTIVE' && (!a.expiresAt || new Date(a.expiresAt) > new Date())
          );
          
          set({ announcements: activeAnnouncements, isLoading: false });
        } catch (error) {
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
          const newAnnouncement: Announcement = {
            id: announcementIdCounter++,
            ...data,
            createdBy,
            createdByName,
            createdByRole,
            status: 'ACTIVE',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          set((state) => ({
            announcements: [newAnnouncement, ...state.announcements],
            isLoading: false,
          }));
        } catch (error) {
          set({ error: 'Failed to create announcement', isLoading: false });
        }
      },

      updateAnnouncement: async (id: number, data: UpdateAnnouncementRequest) => {
        set({ isLoading: true, error: null });
        try {
          set((state) => ({
            announcements: state.announcements.map((a) =>
              a.id === id
                ? {
                    ...a,
                    ...data,
                    updatedAt: new Date().toISOString(),
                  }
                : a
            ),
            isLoading: false,
          }));
        } catch (error) {
          set({ error: 'Failed to update announcement', isLoading: false });
        }
      },

      deleteAnnouncement: async (id: number) => {
        set({ isLoading: true, error: null });
        try {
          set((state) => ({
            announcements: state.announcements.filter((a) => a.id !== id),
            isLoading: false,
          }));
        } catch (error) {
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
