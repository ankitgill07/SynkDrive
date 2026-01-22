
import { File } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { FaFolder } from "react-icons/fa";
import { IoMdMore } from "react-icons/io";
import { Link, useParams, } from 'react-router-dom';
import ChildFoldersViews from './FolderCard';
import ActionCard from '../components/storage/ActionCard';


function RootFoldersViews({ folderData , Allfolder}) {

  return ( <div>
    <div className="w-full mt-5 py-8   ">
      <div className="mb-6">
        <p className="text-lg font-semibold text-gray-800">
          Suggested Folders
        </p>
      </div>
      <div className="grid gap-4 [grid-template-columns:repeat(auto-fill,16rem)] ">
        {folderData?.map((folder) => (
          <ChildFoldersViews key={folder._id} folder={folder} />
        ))}
      </div>
    </div>
  </div>
  )
}

export default RootFoldersViews