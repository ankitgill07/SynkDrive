import React from 'react'
import { FaHeadphones } from "react-icons/fa";

export const renderFilePreview = ({ folder }) => {
    switch (folder.extension) {
        case ".jpg":
        case ".jpeg":
        case ".webp":
        case ".png":
        case ".gif":
            return <img className=' object-cover w-full h-full rounded-sm ' src={`${import.meta.env.VITE_BACKEND_BASE_URL}/file/${folder._id}`} alt="" />;

        case ".pdf":
        case ".md":
        case ".text":
        case ".mp4":
        case ".webm":
        case ".ogg":
            return <iframe
                src={`${import.meta.env.VITE_BACKEND_BASE_URL}/file/${folder._id}#toolbar=0&navpanes=0&scrollbar=0&page=1`}
                className="w-full h-full rounded-sm pointer-events-none"
                style={{ border: "none" }}
                scrolling="no"
            />

        case ".mp3":
        case ".wav":
            return <FaHeadphones />;

        default:
            return <div>not preview</div>;
    }
};
