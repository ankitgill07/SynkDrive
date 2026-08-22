import {
  getListPeopleAccessFileApi,
  shareFileToggleApi,
  shareFileWithEmailInviteApi,
  shareWithLinkPermissionsChangeApi,
  shareWithPublicLinkApi,
} from "@/api/shareApi";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const useShare = (items) => {
  const [activeTab, setActiveTab] = useState("link");

  const [showShareModal, setShowShareModal] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [linkEnabled, setLinkEnabled] = useState(false);
  const [linkPermission, setLinkPermission] = useState("viewer");
  const [isLoading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [copied, setCopied] = useState(false);
  const [shareByEmail, setShareByEmail] = useState([]);

  const openShareModal = async () => {
    setShowShareModal(true);
    setLoading(true);
    document.body.style.overflow = "hidden"
    try {
      const result = await shareWithPublicLinkApi(items._id);
      if (result?.success) {
        setShareLink(result.data.shareUrl);
        setLinkEnabled(result.data.linkEnabled);
        setLinkPermission(result.data.linkPermission);
      }
      handleGetPeopleAccessFile()
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async () => {
    const previousValue = linkEnabled;
    const newValue = !previousValue;

    setLinkEnabled(newValue);

    try {
      const result = await shareFileToggleApi(items._id, newValue);

      if (result?.success) {
        setLinkEnabled(result.data.linkEnabled);
      }
    } catch (error) {
      setLinkEnabled(previousValue);
      console.error(error);
    }
  };

  const handleChangePermission = async (permission) => {
    try {
      const result = await shareWithLinkPermissionsChangeApi(
        items._id,
        permission,
      );

      if (result?.success) {
        setLinkPermission(result.data.linkPermission);
      }
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * Send email invite
   */
  const handleSendFileWithEmail = async (data) => {
    try {
      const result = await shareFileWithEmailInviteApi(items._id, data);
      console.log(result);
  
    } catch (error) {
      console.error(error);
    }
  };

  const handleGetPeopleAccessFile = async () => {
    try {
      const result = await getListPeopleAccessFileApi(items._id);
      console.log(result);
              setShareByEmail(result.data)
    } catch (error) {
      console.log(error);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  /**
   * Close modal
   */
  const closeShareModal = () => {
    setShowShareModal(false);
    document.body.style.overflow = "auto"
  };

  return {
    activeTab,
    setActiveTab,
    showShareModal,
    openShareModal,
    closeShareModal,
    setShowShareModal,
    shareLink,
    linkEnabled,
    linkPermission,
    email,
    setEmail,
    copied,
    isLoading,
    handleToggle,
    handleChangePermission,
    handleCopyLink,
    handleSendFileWithEmail,
    shareByEmail,
  };
};

export default useShare;
