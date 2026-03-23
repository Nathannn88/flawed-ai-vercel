/** 拖拽状态共享 ref */
export interface DragState {
  isDragging: boolean;
  clientX: number;
  clientY: number;
}

export type PetForm = 'sphere' | 'cube' | 'toaster';
