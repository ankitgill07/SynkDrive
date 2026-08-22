import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Mail, X, MessageSquare, Send, Share2, Loader2 } from "lucide-react";
import { getUsertoShareFileEmailApi, shareFileWithEmailInviteApi } from "@/api/shareApi";
import { Field, FieldGroup } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { selectRole } from "@/utils/Helpers";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MESSAGE_MAX_LENGTH = 280;


export default function InviteByEmail({ items }) {
  const [emails, setEmails] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const debounceRef = useRef(null);
  const inputRef = useRef(null);
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      role: "viewer",
      message: "",
    },
  });

  const messageValue = watch("message") || "";

  const abortRef = useRef(null);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputValue(val);
    setError("");
    setActiveIdx(-1);
    setSuggestions([]);
    setShowDropdown(false);

    if (abortRef.current) abortRef.current.abort();
    clearTimeout(debounceRef.current);

    if (!val.trim() || !EMAIL_REGEX.test(val.trim())) {
      setIsSearching(false);
      return;
    }

    abortRef.current = new AbortController();
    setIsSearching(true);
    setShowDropdown(true);

    debounceRef.current = setTimeout(async () => {
      try {
        const result = await getUsertoShareFileEmailApi(
          val.trim(),
          abortRef.current.signal
        );

        const users = Array.isArray(result?.data) ? result.data : [];
        setSuggestions(users);
      } catch (err) {
        if (err.name === "AbortError" || err.name === "CanceledError") return;
        setSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    }, 400);
  };
  // Add a user from suggestion click
  const selectSuggestion = (user) => {
    if (emails.find((e) => e.email === user.email)) {
      setError("Already added");
      return;
    }
    setEmails((prev) => [...prev, user]);
    setInputValue("");
    setSuggestions([]);
    setShowDropdown(false);
    setError("");
    inputRef.current?.focus();
  };

  // Updated keyboard handler
  const handleKeyDown = (e) => {
    if (showDropdown && suggestions.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIdx((i) => Math.min(i + 1, suggestions.length - 1));
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIdx((i) => Math.max(i - 1, 0));
        return;
      }
      if (e.key === "Enter" && activeIdx >= 0) {
        e.preventDefault();
        selectSuggestion(suggestions[activeIdx]);
        return;
      }
      if (e.key === "Escape") {
        setShowDropdown(false);
        return;
      }
    }
    if (e.key === "Backspace" && !inputValue && emails.length > 0) {
      setEmails((prev) => prev.slice(0, -1));
    }
  };

  // Updated send — emails are now objects { name, email }
  const handleSendFileWithEmail = async (data) => {
    if (emails.length === 0) {
      setError("Add at least one person");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const emailAddresses = emails.map((u) => u.email);
      await shareFileWithEmailInviteApi(items._id, emailAddresses, data);

      const newUsers = emails.map((u, idx) => ({
        id: Date.now() + idx,
        email: u.email,
        name: u.name,
        role: data.role,
        avatar: data.picture,
      }));

      setUsers((prev) => [...newUsers, ...prev]);
      setEmails([]);
      setInputValue("");
      reset({ role: data.role, message: "" });
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    }

    setIsLoading(false);
  };

const removeEmail = (email) => {
  setEmails((prev) => prev.filter((e) => e.email !== email));
};

  return (
    <div className="w-full  mx-auto font-inter ">
      <div className="p-6 space-y-5">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">
            Invite people by email
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            Add one or more email addresses, separated by commas or Enter.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(handleSendFileWithEmail)}
          className="space-y-4"
        >
          {/* Multi-email chip input styled like an email "To" field */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              To
            </label>
            <div className="flex gap-4">
              {/* JSX — replace the chip input div */}
              <div className=" w-full relative">
                <div className={`flex flex-wrap items-center gap-2 w-full min-h-[3rem] px-3 py-2 border rounded-lg cursor-text transition-colors ${error ? "border-red-300" : "border-gray-200 focus-within:ring-2 focus-within:ring-blue-500"
                  }`} onClick={() => inputRef.current?.focus()}>
                  {emails.map((user) => (
                    <span key={user.email} className="flex items-center gap-1.5 bg-blue-50 text-blue-700 text-sm font-medium pl-3 pr-2 py-1 rounded-full">
                      <img className=" w-5 h-5 rounded-full" src={user?.picture} alt="" />
                      {user.email}
                      <button type="button" onClick={() => removeEmail(user.email)} className="rounded-full hover:bg-blue-100 p-0.5">
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                    placeholder={emails.length === 0 ? "Search people…" : "Add another"}
                    className="flex-1 min-w-[140px] outline-none text-sm py-1 bg-transparent placeholder:text-gray-400"
                  />
                </div>

                {/* Suggestion dropdown */}
                {showDropdown && (
                  <div className="absolute top-full mt-1 left-0 right-0 z-50 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                    {isSearching ? (
                      <div className="flex items-center gap-2 px-4 py-3 text-sm text-gray-500">
                        <Loader2 size={14} className="animate-spin" /> Searching…
                      </div>
                    ) : suggestions?.length === 0 ? (
                      <div className="px-4 py-3 text-sm text-gray-500">
                        No user found for "{inputValue}"
                      </div>
                    ) : (
                      suggestions?.map((user, i) => (
                        <div
                          key={user?._id}
                          onMouseDown={() => selectSuggestion(user)}
                          className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer border-b last:border-0 border-gray-100 ${i === activeIdx ? "bg-gray-50" : "hover:bg-gray-50"
                            }`}
                        >
                          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 text-xs font-medium flex items-center justify-center flex-shrink-0">
                            <img className="rounded-full w-full h-full" src={user?.picture} alt="avtar" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{user.name}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>              <div className=" w-30 relative">
                {selectRole()}
              </div>
            </div>
            {error && (
              <p className="text-red-500 pt-1 text-xs font-medium">{error}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="invite-message"
              className="flex items-center gap-1.5 text-xs font-medium text-gray-700 mb-1.5"
            >
              <MessageSquare size={13} className="text-gray-400" />
              Message
              <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <textarea
              id="invite-message"
              rows={5}
              placeholder="Add a personal note to your invite..."
              {...register("message", {
                maxLength: {
                  value: MESSAGE_MAX_LENGTH,
                  message: `Message can't be longer than ${MESSAGE_MAX_LENGTH} characters`,
                },
              })}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-400"
            />
            <div className="flex justify-between mt-1">
              {errors.message ? (
                <p className="text-red-500 text-xs font-medium">
                  {errors.message.message}
                </p>
              ) : (
                <span />
              )}
              <span className="text-xs text-gray-400">
                {messageValue.length}/{MESSAGE_MAX_LENGTH}
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center cursor-pointer gap-2 active:scale-95"
          >
            {isLoading ? (
              "Sharing..."
            ) : (
              <>
                <Share2 size={18} />
                Share
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
