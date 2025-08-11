function BlurOverlay({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      <div className="absolute inset-0 backdrop-blur-sm bg-white/50 z-10 flex items-center justify-center">
        <span className="text-gray-600"></span>
      </div>
      {children}
    </div>
  );
}

export default BlurOverlay