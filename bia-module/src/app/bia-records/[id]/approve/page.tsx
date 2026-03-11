'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useUserProfile } from '@/contexts/UserProfileContext';
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationCircleIcon,
  ChatBubbleLeftRightIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

interface BIARecord {
  id: number;
  biaName: string;
  biaType: string;
  targetName: string;
  status: string;
  workflowStage: string;
  workflowStatus: string;
  championName: string;
  smeName?: string;
  createdAt: string;
  updatedAt?: string;
  data: any; // BIA wizard data
}

interface Comment {
  id: number;
  userId: number;
  userName: string;
  userRole: string;
  comment: string;
  createdAt: string;
  commentType: 'GENERAL' | 'CHANGE_REQUEST' | 'APPROVAL' | 'REJECTION';
}

/**
 * BIA Review/Approval Interface
 * 
 * Read-only view of completed BIA wizard with:
 * - All wizard steps displayed in read-only mode
 * - Comment system for reviewers
 * - Approve/Reject/Request Changes actions
 * - Used by Division Head, BCM Verifier, and Chief Approver
 */
export default function BIAApprovePage() {
  const params = useParams();
  const router = useRouter();
  const { currentUser } = useUserProfile();
  const biaId = parseInt(params.id as string);

  const [loading, setLoading] = useState(true);
  const [biaRecord, setBiaRecord] = useState<BIARecord | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [actionInProgress, setActionInProgress] = useState(false);

  useEffect(() => {
    fetchBIARecord();
    fetchComments();
  }, [biaId]);

  const fetchBIARecord = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8080/api/bias/${biaId}`);
      if (response.ok) {
        const data = await response.json();
        setBiaRecord(data);
      }
    } catch (error) {
      console.error('Error fetching BIA record:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/bia-approval/comments/${biaId}`);
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const response = await fetch('http://localhost:8080/api/bia-approval/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          biaId,
          userId: currentUser?.id,
          comment: newComment,
          commentType: 'GENERAL'
        })
      });

      if (response.ok) {
        setNewComment('');
        setShowCommentBox(false);
        fetchComments();
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleApprove = async () => {
    const comments = prompt('Add approval comments (optional):');
    
    try {
      setActionInProgress(true);
      const response = await fetch('http://localhost:8080/api/bia-approval/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          biaId,
          approverId: currentUser?.id,
          comments
        })
      });

      if (response.ok) {
        alert('BIA approved successfully!');
        router.push('/dashboard');
      } else {
        alert('Failed to approve BIA');
      }
    } catch (error) {
      console.error('Error approving BIA:', error);
      alert('Failed to approve BIA');
    } finally {
      setActionInProgress(false);
    }
  };

  const handleReject = async () => {
    const reason = prompt('Provide reason for rejection:');
    if (!reason) return;

    const confirmed = confirm('Are you sure you want to reject this BIA?');
    if (!confirmed) return;

    try {
      setActionInProgress(true);
      const response = await fetch('http://localhost:8080/api/bia-approval/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          biaId,
          approverId: currentUser?.id,
          reason
        })
      });

      if (response.ok) {
        alert('BIA rejected');
        router.push('/dashboard');
      } else {
        alert('Failed to reject BIA');
      }
    } catch (error) {
      console.error('Error rejecting BIA:', error);
      alert('Failed to reject BIA');
    } finally {
      setActionInProgress(false);
    }
  };

  const handleRequestChanges = async () => {
    const changes = prompt('Describe the changes needed:');
    if (!changes) return;

    try {
      setActionInProgress(true);
      const response = await fetch('http://localhost:8080/api/bia-approval/request-changes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          biaId,
          reviewerId: currentUser?.id,
          comments: changes
        })
      });

      if (response.ok) {
        alert('Change request sent successfully!');
        router.push('/dashboard');
      } else {
        alert('Failed to request changes');
      }
    } catch (error) {
      console.error('Error requesting changes:', error);
      alert('Failed to request changes');
    } finally {
      setActionInProgress(false);
    }
  };

  const getCommentTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'GENERAL': 'bg-gray-100 text-gray-700',
      'CHANGE_REQUEST': 'bg-yellow-100 text-yellow-700',
      'APPROVAL': 'bg-green-100 text-green-700',
      'REJECTION': 'bg-red-100 text-red-700'
    };
    return colors[type] || colors['GENERAL'];
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-3"></div>
          <p className="text-xs text-gray-600">Loading BIA record...</p>
        </div>
      </div>
    );
  }

  if (!biaRecord) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-sm text-red-600">BIA record not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => router.push('/dashboard')}
            className="inline-flex items-center px-2.5 py-1.5 text-xs text-gray-600 hover:text-gray-900"
          >
            <ArrowLeftIcon className="h-3.5 w-3.5 mr-1" />
            Back to Dashboard
          </button>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Review BIA: {biaRecord.biaName}</h1>
            <p className="mt-0.5 text-xs text-gray-500">
              {biaRecord.biaType} • Submitted by {biaRecord.smeName || biaRecord.championName}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-3 py-1.5 rounded-sm text-xs font-medium bg-purple-100 text-purple-700">
              <EyeIcon className="h-3.5 w-3.5 mr-1" />
              Review Mode
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto px-6 py-4">
        <div className="max-w-5xl mx-auto space-y-4">
          {/* BIA Data Display - Read-only */}
          <div className="bg-white border border-gray-200 rounded-sm p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">BIA Information</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">
                  BIA Name
                </label>
                <p className="text-xs text-gray-900">{biaRecord.biaName}</p>
              </div>
              <div>
                <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">
                  Target
                </label>
                <p className="text-xs text-gray-900">{biaRecord.targetName}</p>
              </div>
              <div>
                <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">
                  Champion
                </label>
                <p className="text-xs text-gray-900">{biaRecord.championName}</p>
              </div>
              {biaRecord.smeName && (
                <div>
                  <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">
                    SME
                  </label>
                  <p className="text-xs text-gray-900">{biaRecord.smeName}</p>
                </div>
              )}
            </div>
            
            {/* TODO: Display all wizard steps in read-only mode */}
            <div className="mt-4 p-3 bg-gray-50 rounded-sm">
              <p className="text-xs text-gray-600">
                Full BIA wizard data will be displayed here in read-only mode
              </p>
            </div>
          </div>

          {/* Comments Section */}
          <div className="bg-white border border-gray-200 rounded-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-900">Comments & Discussion</h3>
              <button
                onClick={() => setShowCommentBox(!showCommentBox)}
                className="inline-flex items-center px-2 py-1 text-[10px] font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50"
              >
                <ChatBubbleLeftRightIcon className="h-3 w-3 mr-0.5" />
                Add Comment
              </button>
            </div>

            {showCommentBox && (
              <div className="mb-3 p-3 bg-gray-50 rounded-sm">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                  placeholder="Add your comment..."
                />
                <div className="mt-2 flex justify-end gap-2">
                  <button
                    onClick={() => {
                      setShowCommentBox(false);
                      setNewComment('');
                    }}
                    className="px-2 py-1 text-[10px] font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddComment}
                    className="px-2 py-1 text-[10px] font-medium text-white bg-gray-900 rounded-sm hover:bg-gray-800"
                  >
                    Post Comment
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-2">
              {comments.length === 0 ? (
                <p className="text-xs text-gray-500 text-center py-4">No comments yet</p>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="p-3 bg-gray-50 rounded-sm">
                    <div className="flex items-start justify-between mb-1">
                      <div>
                        <span className="text-xs font-medium text-gray-900">{comment.userName}</span>
                        <span className="text-[10px] text-gray-500 ml-2">{comment.userRole}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-medium ${getCommentTypeColor(comment.commentType)}`}>
                          {comment.commentType.replace('_', ' ')}
                        </span>
                        <span className="text-[10px] text-gray-500">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-700">{comment.comment}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="bg-white border-t border-gray-200 px-6 py-3">
        <div className="max-w-5xl mx-auto flex justify-end gap-2">
          <button
            onClick={handleRequestChanges}
            disabled={actionInProgress}
            className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-sm hover:bg-yellow-100 disabled:opacity-50"
          >
            <ExclamationCircleIcon className="h-3.5 w-3.5 mr-1" />
            Request Changes
          </button>
          
          {currentUser?.role === 'APPROVER' && (
            <button
              onClick={handleReject}
              disabled={actionInProgress}
              className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-sm hover:bg-red-100 disabled:opacity-50"
            >
              <XCircleIcon className="h-3.5 w-3.5 mr-1" />
              Reject
            </button>
          )}
          
          <button
            onClick={handleApprove}
            disabled={actionInProgress}
            className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-green-600 border border-transparent rounded-sm hover:bg-green-700 disabled:opacity-50"
          >
            {actionInProgress ? (
              <>
                <svg className="animate-spin -ml-1 mr-1 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              <>
                <CheckCircleIcon className="h-3.5 w-3.5 mr-1" />
                {currentUser?.role === 'DIVISION_HEAD' ? 'Approve & Send to Verifier' :
                 currentUser?.role === 'BCM_VERIFIER' ? 'Verify & Send to Approver' :
                 'Final Approval'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

