'use client';

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, MagnifyingGlassIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

interface LibraryItem {
  id: string;
  name: string;
  [key: string]: any;
}

interface LibrarySelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  items: LibraryItem[];
  selectedIds: string[];
  onSelect: (id: string) => void;
  multiSelect?: boolean;
  renderItem?: (item: LibraryItem, isSelected: boolean) => React.ReactNode;
}

export default function LibrarySelectionModal({
  isOpen,
  onClose,
  title,
  description,
  items,
  selectedIds,
  onSelect,
  multiSelect = true,
  renderItem
}: LibrarySelectionModalProps) {
  const handleSelect = (id: string) => {
    onSelect(id);
    if (!multiSelect) {
      onClose();
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-40" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-sm bg-white shadow-xl transition-all">
                {/* Header */}
                <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Dialog.Title className="text-sm font-semibold text-gray-900">
                        {title}
                      </Dialog.Title>
                      {description && (
                        <p className="mt-1 text-xs text-gray-500">{description}</p>
                      )}
                    </div>
                    <button
                      onClick={onClose}
                      className="rounded-sm p-1 text-gray-400 hover:text-gray-500 hover:bg-gray-200"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Search */}
                <div className="border-b border-gray-200 px-6 py-3">
                  <div className="relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search..."
                      className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
                    />
                  </div>
                </div>

                {/* Items List */}
                <div className="max-h-96 overflow-y-auto px-6 py-4">
                  <div className="space-y-2">
                    {items.map((item) => {
                      const isSelected = selectedIds.includes(item.id);
                      
                      if (renderItem) {
                        return (
                          <button
                            key={item.id}
                            onClick={() => handleSelect(item.id)}
                            className="w-full text-left"
                          >
                            {renderItem(item, isSelected)}
                          </button>
                        );
                      }

                      return (
                        <button
                          key={item.id}
                          onClick={() => handleSelect(item.id)}
                          className={`w-full p-3 border-2 rounded-sm text-left transition-all ${
                            isSelected
                              ? 'border-green-500 bg-green-50'
                              : 'border-gray-200 bg-white hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-900">{item.name}</span>
                            {isSelected && (
                              <CheckCircleIcon className="h-5 w-5 text-green-600" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Footer */}
                <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-500">
                      {selectedIds.length} selected
                    </p>
                    <button
                      onClick={onClose}
                      className="px-4 py-2 text-sm font-medium rounded-sm bg-gray-900 text-white hover:bg-gray-800"
                    >
                      Done
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
