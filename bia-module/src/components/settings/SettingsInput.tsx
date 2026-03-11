import React, { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes } from 'react';

interface SettingsInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helpText?: string;
  required?: boolean;
}

/**
 * Standardized input component for Settings pages
 * Uses Golf Saudi green theme for focus states
 */
export function SettingsInput({
  label,
  error,
  helpText,
  required,
  className = '',
  ...props
}: SettingsInputProps) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        className={`
          w-full px-3 py-2 text-sm
          border border-gray-300 rounded-md
          focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
          disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
          ${error ? 'border-red-300 focus:ring-red-500' : ''}
          ${className}
        `}
        {...props}
      />
      {helpText && !error && (
        <p className="text-xs text-gray-500">{helpText}</p>
      )}
      {error && (
        <p className="text-xs text-red-600">{error}</p>
      )}
    </div>
  );
}

interface SettingsTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  helpText?: string;
  required?: boolean;
}

/**
 * Standardized textarea component for Settings pages
 */
export function SettingsTextarea({
  label,
  error,
  helpText,
  required,
  className = '',
  ...props
}: SettingsTextareaProps) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <textarea
        className={`
          w-full px-3 py-2 text-sm
          border border-gray-300 rounded-md
          focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
          disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
          ${error ? 'border-red-300 focus:ring-red-500' : ''}
          ${className}
        `}
        rows={4}
        {...props}
      />
      {helpText && !error && (
        <p className="text-xs text-gray-500">{helpText}</p>
      )}
      {error && (
        <p className="text-xs text-red-600">{error}</p>
      )}
    </div>
  );
}

interface SettingsSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  helpText?: string;
  required?: boolean;
  options: Array<{ value: string | number; label: string }>;
}

/**
 * Standardized select component for Settings pages
 */
export function SettingsSelect({
  label,
  error,
  helpText,
  required,
  options,
  className = '',
  ...props
}: SettingsSelectProps) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select
        className={`
          w-full px-3 py-2 text-sm
          border border-gray-300 rounded-md
          focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
          disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
          ${error ? 'border-red-300 focus:ring-red-500' : ''}
          ${className}
        `}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {helpText && !error && (
        <p className="text-xs text-gray-500">{helpText}</p>
      )}
      {error && (
        <p className="text-xs text-red-600">{error}</p>
      )}
    </div>
  );
}

interface SettingsToggleProps {
  label: string;
  description?: string;
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  disabled?: boolean;
}

/**
 * Standardized toggle switch component for Settings pages
 * Uses Golf Saudi green theme
 */
export function SettingsToggle({
  label,
  description,
  enabled,
  onChange,
  disabled = false
}: SettingsToggleProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        {description && (
          <p className="text-xs text-gray-500 mt-0.5">{description}</p>
        )}
      </div>
      <button
        type="button"
        onClick={() => !disabled && onChange(!enabled)}
        disabled={disabled}
        className={`
          relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent
          transition-colors duration-200 ease-in-out
          focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
          ${enabled ? 'bg-green-600' : 'bg-gray-200'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <span
          className={`
            pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0
            transition duration-200 ease-in-out
            ${enabled ? 'translate-x-5' : 'translate-x-0'}
          `}
        />
      </button>
    </div>
  );
}

