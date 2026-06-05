import { useFileProgress } from '@/contextApi/FileProgress';
import React, { useCallback, useRef, useState } from 'react'

function useDragAndDrop() {
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const dragCounter = useRef(0);
  const { processFiles } = useFileProgress();

  const readEntryRecursively = (entry) => {
    return new Promise((resolve) => {
      if (entry.isFile) {
        entry.file(
          (file) => resolve([file]),
          (err) => {
            console.error("Failed to read file:", entry.name, err);
            resolve([]);
          }
        );
      } else if (entry.isDirectory) {
        const reader = entry.createReader();
        const allFiles = [];

        const readBatch = () => {
          reader.readEntries(
            async (entries) => {
              if (entries.length === 0) {
                resolve(allFiles);
                return;
              }
              const nested = await Promise.all(
                entries.map((e) => readEntryRecursively(e))
              );
              allFiles.push(...nested.flat());
              readBatch();
            },
            (err) => {
              console.error("Failed to read directory:", entry.name, err);
              resolve(allFiles);
            }
          );
        };

        readBatch();
      } else {
        resolve([]);
      }
    });
  };

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current += 1;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDraggingOver(true);
      document.body.style.overflow = "hidden";
    }
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current -= 1;
    if (dragCounter.current === 0) {
      setIsDraggingOver(false);
      document.body.style.overflow = "auto";
    }
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "copy";
  }, []);

  const handleDrop = useCallback(
    async (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDraggingOver(false);
      dragCounter.current = 0;
      document.body.style.overflow = "auto";

      const items = Array.from(e.dataTransfer.items);
      if (items.length === 0) return;

      const entries = items
        .map((item) => item.webkitGetAsEntry?.())
        .filter(Boolean);

      console.log("Dropped entries:", entries.map((e) => ({ name: e.name, isDirectory: e.isDirectory })));

      if (entries.length === 0) {
        // fallback for browsers without webkitGetAsEntry
        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) await processFiles(files);
        return;
      }

      const allFiles = (
        await Promise.all(entries.map((entry) => readEntryRecursively(entry)))
      ).flat();

      console.log("Resolved files:", allFiles.map((f) => f.name));

      if (allFiles.length === 0) return;
      await processFiles(allFiles);
    },
    [processFiles]
  );

  return {
    isDraggingOver,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
  };
}

export default useDragAndDrop;