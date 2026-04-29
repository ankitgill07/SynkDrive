import {
  shareFileToggleApi,
  shareFileWithEmailInviteApi,
  shareWithLinkPermissionsChangeApi,
  shareWithPublicLinkApi,
} from "@/api/shareApi";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

function useShare(items) {
  const [activeTab, setActiveTab] = useState("link");

  const [showShareModal, setShowShareModal] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [linkEnabled, setLinkEnabled] = useState(false);
  const [selectedRole, setSelectedRole] = useState("viewer");
  const [linkPermission, setLinkPermission] = useState("viewer");
  const [isLoading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    initializeModalData();
  }, [items?._id]);

  const initializeModalData = async () => {
    setLoading(true);
    try {
      await handleSharePublicLink("viewer");
    } catch (err) {
      console.error("Init failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSharePublicLink = async (permission) => {
    try {
      const result = await shareWithPublicLinkApi(items._id, permission);
      if (result.success) {
        setShareLink(result.data.shareUrl);
        setLinkPermission(result.data.linkPermission);
        setLinkEnabled(result.data.linkEnabled);
      }
    } catch (error) {
    } finally {
    }
  };

  const handleToggle = async () => {
    const newValue = !linkEnabled;
    setLinkEnabled(newValue);
    try {
      const result = await shareFileToggleApi(items._id, newValue);
      if (res.success) {
        setLinkEnabled(result.data.linkEnabled);
      }
    } catch (error) {}
  };

  const handleChangePermission = async (permission) => {
    try {
      const result = await shareWithLinkPermissionsChangeApi(
        items._id,
        permission,
      );
      if (result.success) {
        setLinkPermission(result.data.linkPermission);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSendFileWitEmail = async (data) => {
    try {
      console.log(data);
      const result = await shareFileWithEmailInviteApi(items._id, data);
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.log("[v0] Copy failed:", err);
    }
  };

  return {
    activeTab,
    setActiveTab,
    handleSharePublicLink,
    shareLink,
    linkEnabled,
    setLinkEnabled,
    linkPermission,
    setLinkPermission,
    showShareModal,
    copied,
    setShowShareModal,
    handleChangePermission,
    handleCopyLink,
    handleToggle,
    isLoading,
    handleSendFileWitEmail,
    setEmail,
    email,
  };
}

export default useShare;
