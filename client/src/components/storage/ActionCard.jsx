
import DraggableDialog from '@/models/AlertDialogDemo'
import FadeMenu  from '@/models/BasicMenu'
import { ArrowUpFromLine, ChevronDown, FolderPlus, Plus } from 'lucide-react'
import React from 'react'

function ActionCard({ Allfolder }) {


    return (
        <div className="w-full">
            <div className="fixed  top-18  left-65 w-[calc(100%-260px)] z-50 flex justify-between items-center bg-white px-6  py-4 ">
                <p className="font-bold font-plusjakartaSans text-2xl">All files</p>
                <div className="flex items-center gap-x-2">
                    <FadeMenu Allfolder={Allfolder} />
                    <DraggableDialog Allfolder={Allfolder} />
                    <button className="bg-[#d9d4cc3b] hover:bg-[#e9e8e8] cursor-pointer px-2.5 py-1.5 flex items-center rounded-md">
                        <img
                            className="w-5"
                            src="https://png.pngtree.com/png-vector/20230817/ourmid/pngtree-google-internet-icon-vector-png-image_9183287.png"
                            alt=""
                        />
                        <span className="font-plusjakartaSans ml-1.5 font-bold text-sm">
                            Import from Google Drive
                        </span>
                    </button>
                </div>
            </div>
        </div>

    )
}

export default ActionCard