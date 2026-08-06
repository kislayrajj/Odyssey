import { useParams } from 'react-router-dom';

export function CategoryRoadmap() {
  const { categoryId } = useParams<{ categoryId: string }>();

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="font-sans text-2xl font-bold text-text-main mb-4">
        Roadmap Engine
      </h1>
      <p className="text-text-dim">
        Currently viewing category ID: <span className="text-accent font-mono">{categoryId}</span>
      </p>
      <p className="text-text-faint mt-4 text-sm">
        (In Phase 4, this component will dynamically load the topics and items for this category.)
      </p>
    </div>
  );
}