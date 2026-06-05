import {
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


  const openShareModal = async () => {
    setShowShareModal(true);
    setLoading(true);
    try {
      const result = await shareWithPublicLinkApi(items._id);

      if (result?.success) {
        setShareLink(result.data.shareUrl || "");
        setLinkEnabled(result.data.linkEnabled || false);
        setLinkPermission(result.data.linkPermission || "viewer");
      }
    } catch (error) {
      console.error("Failed to load share settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSharePublicLink = async (permission = "viewer") => {
    try {
      const result = await shareWithPublicLinkApi(items._id, permission);

      if (result?.success) {
        setShareLink(result.data.shareUrl);
        setLinkPermission(result.data.linkPermission);
        setLinkEnabled(result.data.linkEnabled);
      }
    } catch (error) {
      console.error(error);
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
  const handleSendFileWitEmail = async (data) => {
    try {
      const result = await shareFileWithEmailInviteApi(items._id, data);

      console.log(result);
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * Copy link
   */
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
    handleSharePublicLink,
    handleToggle,
    handleChangePermission,
    handleCopyLink,
    handleSendFileWitEmail,
  };
};

export default useShare;
