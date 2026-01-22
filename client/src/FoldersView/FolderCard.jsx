import React, { useEffect, useState } from 'react'
import ActionCard from '../components/storage/ActionCard'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getAllFoldersApi } from '@/api/FolderApi'
import { FaFolder } from 'react-icons/fa'
import { IoMdMore } from 'react-icons/io'
import { renderFilePreview } from "../utils/helpers"


function ChildFoldersViews({ folder }) {
  // const [folderData, setFolderData] = useState([])
  // const { parentFolderId } = useParams()


  // const Allfolder = async () => {
  //   const result = await getAllFoldersApi(parentFolderId)
  //   setFolderData(result)
  // }

  // useEffect(() => {
  //   Allfolder()
  // }, [])

  const navigate = useNavigate()

  const handleOpen = () => {
    if (folder.type === 'folder') {
      return navigate(`/drive/folder/${folder._id}`)
    } else {
      return window.open(`${import.meta.env.VITE_BACKEND_BASE_URL}/file/${folder._id}`)
    }
  }

  return (
    <div className="w-64">
      <div onClick={handleOpen}>
        <div
          className="
            h-64 cursor-pointer rounded-lg hover:shadow-sm bg-[#F7F5F2]
            p-2.5 pb-0 transition hover:bg-[#EBE9E6]
          "
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <FaFolder size={22} className="text-[#3F8EFC] flex-shrink-0" />

              <span className="text-sm font-medium text-gray-800 truncate">
                {folder.name}
              </span>
            </div>

            <button
              className="
      p-1
      rounded-full
      hover:bg-[#dfdddb]
      transition
      cursor-pointer
      flex-shrink-0
    "
            >
              <IoMdMore size={20} className="text-gray-600" />
            </button>
          </div>

          <div
            className="
              mt-2.5 h-[calc(100%-52px)] rounded-md bg-white
              flex items-center justify-center overflow-hidden 
            "
          >
            {folder.type === "folder" ?
              <FaFolder size={110} className="text-[#3F8EFC] opacity-90" />
              :
             renderFilePreview({ folder })
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChildFoldersViews