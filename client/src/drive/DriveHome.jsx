import { getAllFoldersApi } from "@/api/FolderApi";
import RootFoldersViews from "@/FolderPages/FolderTree";
import ActionCard from "@/components/storage/ActionCard";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useFolder from "@/hooks/useFolder";

function DriveHome() {
  const {allItems , Allfolder} = useFolder()



  return (
    <div>
      <ActionCard Allfolder={Allfolder} />
      <div className=" mt-7  ">
        <RootFoldersViews folderData={allItems} Allfolder={Allfolder} />
      </div>
    </div>
  );
}

export default DriveHome;
