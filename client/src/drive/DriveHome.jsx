
import { getAllFoldersApi } from '@/api/FolderApi'
import RootFoldersViews from '@/FoldersView/FolderTree'
import ActionCard from '@/components/storage/ActionCard'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

function DriveHome() {
    const [folders, setfolders] = useState([])
    const [files, setFiles] = useState([])
    const { id } = useParams()

    const Allfolder = async () => {
        const result = await getAllFoldersApi(id)
        const { folders, files } = result.data
        setfolders(folders)
        setFiles(files)
    }

    const allItems = [...folders, ...files].sort((a, b) => {
        if (a.type === "folder" && b.type === "file") return -1
        if (a.type === "file" && b.type === "folder") return 1
    })

    

    useEffect(() => {
        Allfolder()
    }, [id])

    return (
        <div>
            <ActionCard Allfolder={Allfolder} />
            <div className=' mt-7  '>
                <RootFoldersViews folderData={allItems} Allfolder={Allfolder} />
            </div>
        </div>
    )
}

export default DriveHome