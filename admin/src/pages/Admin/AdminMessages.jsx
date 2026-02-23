// pages/admin/AdminMessages.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  FaEnvelope,
  FaEnvelopeOpen,
  FaTrash,
  FaUser,
  FaCalendarAlt,
  FaSpinner,
  FaClock,
  FaCheckCircle,
  FaRegEnvelope,
  FaExpandAlt,
  FaCompressAlt,
  FaSearch,
  FaFilter,
  FaEye,
  FaReply,
  FaMobile,
  FaTablet,
  FaExclamationTriangle,
  FaTimes,
  FaCheck,
  FaSyncAlt,
} from "react-icons/fa";

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [stats, setStats] = useState({ total: 0, unread: 0 });
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [expandedMessage, setExpandedMessage] = useState(null);

  // Delete confirmation modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState(null);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${backendUrl}/api/message/admin/all`);

      if (data.success) {
        setMessages(data.messages);
        setStats(data.stats);
      } else {
        toast.error("Failed to load messages");
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    fetchMessages();
  }, []);

  const markAsRead = async (messageId) => {
    try {
      const { data } = await axios.put(
        `${backendUrl}/api/message/admin/${messageId}/read`,
        {},
      );

      if (data.success) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg._id === messageId ? { ...msg, isRead: true } : msg,
          ),
        );
        setStats((prev) => ({ ...prev, unread: prev.unread - 1 }));
        toast.success("Message marked as read");
      }
    } catch (error) {
      console.error("Error marking message as read:", error);
      toast.error("Failed to update message");
    }
  };

  // Open delete confirmation modal
  const confirmDelete = (messageId) => {
    setMessageToDelete(messageId);
    setShowDeleteModal(true);
  };

  // Close delete confirmation modal
  const cancelDelete = () => {
    setShowDeleteModal(false);
    setMessageToDelete(null);
  };

  // Execute delete
  const deleteMessage = async () => {
    if (!messageToDelete) return;

    setDeletingId(messageToDelete);
    setShowDeleteModal(false);

    try {
      const { data } = await axios.delete(
        `${backendUrl}/api/message/admin/${messageToDelete}`,
      );

      if (data.success) {
        setMessages((prev) =>
          prev.filter((msg) => msg._id !== messageToDelete),
        );
        setStats((prev) => ({
          total: prev.total - 1,
          unread: messages.find((m) => m._id === messageToDelete)?.isRead
            ? prev.unread
            : prev.unread - 1,
        }));
        if (selectedMessage?._id === messageToDelete) {
          setSelectedMessage(null);
        }
        if (expandedMessage === messageToDelete) {
          setExpandedMessage(null);
        }
        toast.success("Message deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting message:", error);
      toast.error("Failed to delete message");
    } finally {
      setDeletingId(null);
      setMessageToDelete(null);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const messageDate = new Date(date);
    const diffInHours = Math.floor((now - messageDate) / (1000 * 60 * 60));

    if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} days ago`;
    }
  };

  const formatShortDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const truncateMessage = (message, limit = 60) => {
    if (message.length <= limit) return message;
    return message.substring(0, limit) + "...";
  };

  const toggleExpand = (messageId) => {
    setExpandedMessage(expandedMessage === messageId ? null : messageId);
  };

  const closeDetails = () => {
    setSelectedMessage(null);
  };

  // Filter messages based on search and status
  const filteredMessages = messages.filter((message) => {
    const matchesSearch =
      message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.message.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "unread" && !message.isRead) ||
      (filterStatus === "read" && message.isRead);

    return matchesSearch && matchesStatus;
  });

    // handle refresh button
  const handleRefresh = () => {
    fetchMessages();
    toast.success("Refreshed successfully");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <FaSpinner className="animate-spin text-blue-600 text-5xl mx-auto mb-4" />
          <p className="text-gray-600">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className=" bg-gray-50 min-h-screen">
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden animate-fadeIn">
            {/* Modal Header */}
            <div className="bg-red-500 p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <FaExclamationTriangle className="text-white text-xl" />
              </div>
              <h3 className="text-lg font-semibold text-white">
                Delete Message
              </h3>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <p className="text-gray-700 mb-2">
                Are you sure you want to delete this message?
              </p>
              <p className="text-sm text-gray-500">
                This action cannot be undone. The message will be permanently
                removed.
              </p>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t flex justify-end gap-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition flex items-center gap-2"
              >
                <FaTimes />
                Cancel
              </button>
              <button
                onClick={deleteMessage}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition flex items-center gap-2"
              >
                <FaTrash />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Contact <span className="text-blue-600">Messages</span>
        </h1>
        <p className="text-gray-600 text-base md:text-lg">
          View and manage messages from your contact form
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-blue-500 hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider">
                Total Messages
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stats.total}
              </p>
            </div>
            <div className="bg-blue-100 p-2.5 rounded-full">
              <FaEnvelope className="text-blue-600 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-yellow-500 hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider">
                Unread
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stats.unread}
              </p>
            </div>
            <div className="bg-yellow-100 p-2.5 rounded-full">
              <FaEnvelopeOpen className="text-yellow-600 text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="relative">
            <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white appearance-none"
            >
              <option value="all">All Messages</option>
              <option value="unread">Unread Only</option>
              <option value="read">Read Only</option>
            </select>
          </div>

          <button
            onClick={handleRefresh}
            className="flex items-center justify-center gap-2 px-4 py-2 text-sm bg-[#5f6fff] text-white rounded-lg hover:bg-blue-600 transition-all duration-200 shadow-sm"
          >
            <FaSyncAlt className="text-sm" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Messages Display */}
      {filteredMessages.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <FaRegEnvelope className="text-gray-400 text-2xl" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-1">
            No Messages Found
          </h3>
          <p className="text-gray-500 text-sm">
            {searchTerm || filterStatus !== "all"
              ? "Try adjusting your filters"
              : "Messages from your contact form will appear here"}
          </p>
        </div>
      ) : (
        <>
          {/* Message Details Modal (Same for both views) */}
          {selectedMessage && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto">
                <div className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-900">
                      Message Details
                    </h2>
                    <button
                      onClick={closeDetails}
                      className="p-1.5 hover:bg-gray-100 rounded-full transition"
                    >
                      <FaCompressAlt className="text-gray-500 text-lg" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">From</p>
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <FaUser className="text-blue-600 text-sm" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {selectedMessage.name}
                          </p>
                          <p className="text-xs text-gray-600">
                            {selectedMessage.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">Message</p>
                      <p className="text-gray-800 text-sm whitespace-pre-wrap">
                        {selectedMessage.message}
                      </p>
                    </div>

                    <div className="bg-gray-50 p-3 rounded-lg flex flex-wrap items-center gap-3">
                      <div className="flex items-center gap-1.5 text-xs text-gray-600">
                        <FaCalendarAlt className="text-gray-400" />
                        <span>{formatDate(selectedMessage.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-600">
                        <FaClock className="text-gray-400" />
                        <span>{formatTimeAgo(selectedMessage.createdAt)}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-3">
                      {!selectedMessage.isRead && (
                        <button
                          onClick={() => {
                            markAsRead(selectedMessage._id);
                            setSelectedMessage({
                              ...selectedMessage,
                              isRead: true,
                            });
                          }}
                          className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition flex items-center justify-center gap-1"
                        >
                          <FaCheckCircle className="text-xs" />
                          Mark as Read
                        </button>
                      )}
                      <button
                        onClick={() => confirmDelete(selectedMessage._id)}
                        disabled={deletingId === selectedMessage._id}
                        className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition flex items-center justify-center gap-1 disabled:opacity-50"
                      >
                        {deletingId === selectedMessage._id ? (
                          <FaSpinner className="animate-spin text-xs" />
                        ) : (
                          <>
                            <FaTrash className="text-xs" />
                            Delete
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Mobile View (Cards) - Visible on small screens */}
          <div className="block sm:hidden space-y-3">
            {filteredMessages.map((message) => (
              <div
                key={message._id}
                className={`bg-white rounded-xl shadow-md overflow-hidden
                  ${!message.isRead ? "border-l-4 border-yellow-500" : "border-l-4 border-gray-300"}`}
              >
                <div className="p-4">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center
                        ${!message.isRead ? "bg-yellow-100" : "bg-gray-100"}`}
                      >
                        <FaUser
                          className={`text-sm ${!message.isRead ? "text-yellow-600" : "text-gray-600"}`}
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {message.name}
                        </h3>
                        <p className="text-xs text-gray-500">{message.email}</p>
                      </div>
                    </div>
                    {!message.isRead && (
                      <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-medium">
                        New
                      </span>
                    )}
                  </div>

                  {/* Message */}
                  <div className="bg-gray-50 rounded-lg p-3 mb-3">
                    <p className="text-sm text-gray-800">
                      {expandedMessage === message._id
                        ? message.message
                        : truncateMessage(message.message, 80)}
                    </p>
                    {message.message.length > 80 && (
                      <button
                        onClick={() => toggleExpand(message._id)}
                        className="mt-1 text-blue-600 text-xs font-medium flex items-center gap-1"
                      >
                        {expandedMessage === message._id ? (
                          <>
                            Show Less <FaCompressAlt className="text-xs" />
                          </>
                        ) : (
                          <>
                            Read More <FaExpandAlt className="text-xs" />
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <FaCalendarAlt className="text-xs" />
                      <span>{formatShortDate(message.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {!message.isRead && (
                        <button
                          onClick={() => markAsRead(message._id)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Mark as read"
                        >
                          <FaEnvelopeOpen className="text-sm" />
                        </button>
                      )}
                      <button
                        onClick={() => setSelectedMessage(message)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                        title="View details"
                      >
                        <FaEye className="text-sm" />
                      </button>
                      <button
                        onClick={() => confirmDelete(message._id)}
                        disabled={deletingId === message._id}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                        title="Delete"
                      >
                        {deletingId === message._id ? (
                          <FaSpinner className="animate-spin text-sm" />
                        ) : (
                          <FaTrash className="text-sm" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop View (Table) - Visible on medium screens and up */}
          <div className="hidden sm:block bg-white rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      From
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Message
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredMessages.map((message) => (
                    <tr
                      key={message._id}
                      className={`hover:bg-gray-50 transition ${!message.isRead ? "bg-yellow-50/50" : ""}`}
                    >
                      {/* Status */}
                      <td className="px-4 py-3">
                        {!message.isRead ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                            <span className="w-1.5 h-1.5 bg-yellow-600 rounded-full mr-1 animate-pulse"></span>
                            New
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                            <FaCheckCircle className="mr-1 text-xs" />
                            Read
                          </span>
                        )}
                      </td>

                      {/* From */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center
                            ${!message.isRead ? "bg-yellow-100" : "bg-gray-100"}`}
                          >
                            <FaUser
                              className={`text-xs ${!message.isRead ? "text-yellow-600" : "text-gray-600"}`}
                            />
                          </div>
                          <div>
                            <p className="font-medium text-sm text-gray-900">
                              {message.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {message.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Message */}
                      <td className="px-4 py-3">
                        <p className="text-sm text-gray-800 max-w-xs truncate">
                          {truncateMessage(message.message, 60)}
                        </p>
                      </td>

                      {/* Date */}
                      <td className="px-4 py-3">
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-600">
                            {formatShortDate(message.createdAt)}
                          </span>
                          <span className="text-xs text-gray-400">
                            {formatTimeAgo(message.createdAt)}
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          {!message.isRead && (
                            <button
                              onClick={() => markAsRead(message._id)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                              title="Mark as read"
                            >
                              <FaEnvelopeOpen className="text-sm" />
                            </button>
                          )}
                          <button
                            onClick={() => setSelectedMessage(message)}
                            className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition"
                            title="View details"
                          >
                            <FaEye className="text-sm" />
                          </button>
                          <button
                            onClick={() => confirmDelete(message._id)}
                            disabled={deletingId === message._id}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                            title="Delete"
                          >
                            {deletingId === message._id ? (
                              <FaSpinner className="animate-spin text-sm" />
                            ) : (
                              <FaTrash className="text-sm" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            <div className="px-4 py-3 bg-gray-50 border-t text-xs text-gray-500">
              Showing {filteredMessages.length} of {messages.length} messages
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminMessages;
