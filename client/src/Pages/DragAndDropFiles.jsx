function DragAndDropFiles({ isDraggingOver }) {
  return (
    <div
      className={`
absolute z-50
          -top-8 w-full
          min-h-[55vh] sm:min-h-[65vh] lg:min-h-[calc(100vh-150px)]
          rounded-lg 
          flex flex-col items-center justify-center 
          pointer-events-none
          transition-all duration-200
        ${
          isDraggingOver
            ? "bg-[#155dfc]/[0.07] border-2 border-dashed  border-blue-400 opacity-100"
            : "opacity-0 border-2 border-dashed border-transparent"
        }
      `}
    >
      {isDraggingOver && (
        <>
          <div className="relative flex items-center justify-center w-40 h-40">
            <div
              className="absolute inset-0 rounded-full border-2 border-blue-300/40 animate-ping"
              style={{ animationDuration: "1.8s" }}
            />
            <div
              className="absolute inset-4 rounded-full border-2 border-blue-400/50 animate-ping"
              style={{
                animationDuration: "1.4s",
                animationDelay: "0.2s",
              }}
            />
            <div
              className="absolute inset-8 rounded-full border-[1.5px] border-blue-500/30 animate-ping"
              style={{
                animationDuration: "1.1s",
                animationDelay: "0.4s",
              }}
            />

            <div className="relative z-10 w-20 h-20 rounded-2xl bg-blue-500 shadow-lg shadow-blue-300/50 flex items-center justify-center">
              <svg
                className="w-10 h-10 text-white animate-bounce"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 16.5v-9m0 0-3.75 3.75M12 7.5l3.75 3.75M6.75 19.5a4.5 4.5 0 01-1.632-8.697 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
                />
              </svg>
            </div>
            {[
              {
                color: "bg-blue-400",
                top: "8%",
                left: "2%",
                delay: "0s",
              },
              {
                color: "bg-violet-400",
                top: "12%",
                right: "4%",
                delay: "0.5s",
              },
              {
                color: "bg-emerald-400",
                top: "0%",
                left: "38%",
                delay: "0.9s",
              },
              {
                color: "bg-pink-400",
                top: "5%",
                right: "20%",
                delay: "1.3s",
              },
            ].map((p, i) => (
              <div
                key={i}
                className={`absolute w-2.5 h-2.5 rounded-full ${p.color}`}
                style={{
                  top: p.top,
                  left: p.left,
                  right: p.right,
                  animation: "particleFloat 1.8s ease-out infinite",
                  animationDelay: p.delay,
                  opacity: 0,
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default DragAndDropFiles;
