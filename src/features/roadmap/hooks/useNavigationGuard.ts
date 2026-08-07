import { useEditorStore } from '../store/editorStore';

export function useNavigationGuard() {
  return useEditorStore((state) => state.requestNavigation);
}
