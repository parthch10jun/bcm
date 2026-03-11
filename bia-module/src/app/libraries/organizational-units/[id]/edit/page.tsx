'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { organizationalUnitService } from '@/services/organizationalUnitService';
import { OrganizationalUnit, UnitType, UNIT_TYPE_LABELS } from '@/types/organizationalUnit';
import {
  BuildingOfficeIcon,
  ArrowLeftIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

export default function EditOrganizationalUnitPage() {
  const router = useRouter();
  const params = useParams();
  const unitId = params.id as string;

  const [allUnits, setAllUnits] = useState<OrganizationalUnit[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasRootUnit, setHasRootUnit] = useState(false);
  const [validationErrors, setValidationErrors] = useState({
    unitName: '',
    unitCode: ''
  });
  const [unitCodeStatus, setUnitCodeStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');
  const [formData, setFormData] = useState({
    unitName: '',
    unitCode: '',
    parentUnitId: '',
    unitType: 'DEPARTMENT' as UnitType,
    unitHead: '',
    unitHeadEmail: '',
    unitHeadPhone: '',
    description: '',
    employeeCount: '',
    annualBudget: ''
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [units, unit] = await Promise.all([
          organizationalUnitService.getAll(),
          organizationalUnitService.getById(unitId)
        ]);

        setAllUnits(units);

        // Check if root unit exists (excluding current unit)
        const rootExists = units.some(u => !u.parentUnitId && u.id !== unitId);
        setHasRootUnit(rootExists);

        if (unit) {
          setFormData({
            unitName: unit.unitName,
            unitCode: unit.unitCode || '',
            parentUnitId: unit.parentUnitId || '',
            unitType: unit.unitType,
            unitHead: unit.unitHead || '',
            unitHeadEmail: unit.unitHeadEmail || '',
            unitHeadPhone: unit.unitHeadPhone || '',
            description: unit.description || '',
            employeeCount: unit.employeeCount?.toString() || '',
            annualBudget: unit.annualBudget?.toString() || ''
          });
        }
      } catch (error) {
        console.error('Error loading unit:', error);
        alert('Failed to load organizational unit');
        router.push('/libraries/organizational-units');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [unitId, router]);

  // Get all descendants of current unit (for circular dependency prevention)
  const getDescendantIds = (currentUnitId: string, units: OrganizationalUnit[]): string[] => {
    const descendants: string[] = [];
    const findDescendants = (parentId: string) => {
      units.forEach(unit => {
        if (unit.parentUnitId === parentId) {
          descendants.push(unit.id);
          findDescendants(unit.id);
        }
      });
    };
    findDescendants(currentUnitId);
    return descendants;
  };

  // Validation: Check if unit name already exists under selected parent (excluding self)
  const validateUnitName = async (name: string, parentId: string) => {
    if (!name.trim()) {
      setValidationErrors(prev => ({ ...prev, unitName: '' }));
      return true;
    }

    const duplicate = allUnits.find(u =>
      u.id !== unitId && // Exclude self
      u.unitName.toLowerCase() === name.toLowerCase() &&
      (parentId ? u.parentUnitId === parentId : !u.parentUnitId)
    );

    if (duplicate) {
      const parentName = parentId
        ? allUnits.find(u => u.id === parentId)?.unitName || 'Unknown'
        : 'top level';
      setValidationErrors(prev => ({
        ...prev,
        unitName: `A unit named "${name}" already exists under ${parentName}`
      }));
      return false;
    }

    setValidationErrors(prev => ({ ...prev, unitName: '' }));
    return true;
  };

  // Validation: Check if unit code already exists globally (excluding self)
  const validateUnitCode = async (code: string) => {
    if (!code.trim()) {
      setUnitCodeStatus('idle');
      setValidationErrors(prev => ({ ...prev, unitCode: '' }));
      return true;
    }

    setUnitCodeStatus('checking');

    const duplicate = allUnits.find(u =>
      u.id !== unitId && // Exclude self
      u.unitCode?.toLowerCase() === code.toLowerCase()
    );

    if (duplicate) {
      setUnitCodeStatus('taken');
      setValidationErrors(prev => ({
        ...prev,
        unitCode: `Unit code "${code}" is already in use`
      }));
      return false;
    }

    setUnitCodeStatus('available');
    setValidationErrors(prev => ({ ...prev, unitCode: '' }));
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate before submit
    const nameValid = await validateUnitName(formData.unitName, formData.parentUnitId);
    const codeValid = await validateUnitCode(formData.unitCode);

    if (!nameValid || !codeValid) {
      alert('Please fix validation errors before submitting');
      return;
    }

    try {
      const updatedUnit = await organizationalUnitService.update(unitId, {
        unitName: formData.unitName,
        unitCode: formData.unitCode || undefined,
        parentUnitId: formData.parentUnitId || undefined,
        unitType: formData.unitType,
        unitHead: formData.unitHead || undefined,
        unitHeadEmail: formData.unitHeadEmail || undefined,
        unitHeadPhone: formData.unitHeadPhone || undefined,
        description: formData.description || undefined,
        employeeCount: formData.employeeCount ? parseInt(formData.employeeCount) : undefined,
        annualBudget: formData.annualBudget ? parseFloat(formData.annualBudget) : undefined,
      });

      console.log('Updated organizational unit:', updatedUnit);
      alert(`Organizational unit "${updatedUnit.unitName}" updated successfully!`);
      router.push('/libraries/organizational-units');
    } catch (error: any) {
      console.error('Error updating organizational unit:', error);
      const errorMessage = error.message || 'Failed to update organizational unit. Please try again.';
      alert(`Error: ${errorMessage}`);
    }
  };

  const handleCancel = () => {
    router.push('/libraries/organizational-units');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Re-validate unit name when parent changes
    if (name === 'parentUnitId' && formData.unitName) {
      validateUnitName(formData.unitName, value);
    }
  };

  const handleUnitNameBlur = () => {
    validateUnitName(formData.unitName, formData.parentUnitId);
  };

  const handleUnitCodeBlur = () => {
    validateUnitCode(formData.unitCode);
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-sm text-gray-600">Loading unit...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between mb-3">
          <Link
            href="/libraries/organizational-units"
            className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50"
          >
            <ArrowLeftIcon className="h-3.5 w-3.5 mr-1" />
            Back to Organizational Units
          </Link>
        </div>
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Edit Organizational Unit</h1>
          <p className="mt-0.5 text-xs text-gray-500">
            Update unit information in the organizational hierarchy
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-auto px-6 py-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Basic Information */}
          <div className="bg-white border border-gray-200 rounded-sm">
            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
              <h3 className="text-xs font-medium text-gray-700 uppercase tracking-wider">Basic Information</h3>
            </div>
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label htmlFor="unitName" className="block text-xs font-medium text-gray-700 mb-1">
                    Unit Name *
                  </label>
                  <input
                    type="text"
                    name="unitName"
                    id="unitName"
                    required
                    maxLength={255}
                    value={formData.unitName}
                    onChange={handleChange}
                    onBlur={handleUnitNameBlur}
                    className={`w-full px-3 py-1.5 border rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 ${
                      validationErrors.unitName
                        ? 'border-red-300'
                        : 'border-gray-300'
                    }`}
                  />
                  {validationErrors.unitName && (
                    <p className="mt-0.5 text-[10px] text-red-600">{validationErrors.unitName}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="unitCode" className="block text-xs font-medium text-gray-700 mb-1">
                    Unit Code
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="unitCode"
                      id="unitCode"
                      maxLength={50}
                      value={formData.unitCode}
                      onChange={handleChange}
                      onBlur={handleUnitCodeBlur}
                      className={`w-full px-3 py-1.5 border rounded-sm text-xs font-mono focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 ${
                        validationErrors.unitCode
                          ? 'border-red-300 pr-10'
                          : unitCodeStatus === 'available'
                          ? 'border-green-300 pr-10'
                          : 'border-gray-300'
                      }`}
                    />
                    {unitCodeStatus === 'checking' && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-gray-900"></div>
                      </div>
                    )}
                    {unitCodeStatus === 'available' && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <CheckIcon className="h-4 w-4 text-green-500" />
                      </div>
                    )}
                    {unitCodeStatus === 'taken' && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <XMarkIcon className="h-4 w-4 text-red-500" />
                      </div>
                    )}
                  </div>
                  {validationErrors.unitCode ? (
                    <p className="mt-0.5 text-[10px] text-red-600">{validationErrors.unitCode}</p>
                  ) : unitCodeStatus === 'available' ? (
                    <p className="mt-0.5 text-[10px] text-green-600">✓ Unit code is available</p>
                  ) : null}
                </div>

                <div>
                  <label htmlFor="unitType" className="block text-xs font-medium text-gray-700 mb-1">
                    Unit Type *
                  </label>
                  <select
                    name="unitType"
                    id="unitType"
                    required
                    value={formData.unitType}
                    onChange={handleChange}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                  >
                    {Object.entries(UNIT_TYPE_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="parentUnitId" className="block text-xs font-medium text-gray-700 mb-1">
                    Parent Unit
                  </label>
                  <select
                    name="parentUnitId"
                    id="parentUnitId"
                    value={formData.parentUnitId}
                    onChange={handleChange}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                  >
                    <option value="" disabled={hasRootUnit}>
                      {hasRootUnit
                        ? 'Top Level (Already Exists)'
                        : 'None (Top Level)'}
                    </option>
                    {allUnits
                      .filter(u => {
                        // Exclude self
                        if (u.id === unitId) return false;

                        // Exclude descendants (prevent circular reference)
                        const descendantIds = getDescendantIds(unitId, allUnits);
                        if (descendantIds.includes(u.id)) return false;

                        return true;
                      })
                      .map(unit => (
                        <option key={unit.id} value={unit.id}>
                          {unit.fullPath || unit.unitName}
                        </option>
                      ))}
                  </select>
                  <p className="mt-0.5 text-[10px] text-gray-500">
                    {hasRootUnit
                      ? 'A top-level organization already exists. Select a parent unit or keep current parent.'
                      : 'Select the parent unit in the hierarchy (invalid options are filtered out)'}
                  </p>
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="description" className="block text-xs font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    id="description"
                    rows={3}
                    maxLength={2000}
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                  />
                  <div className="mt-0.5 flex justify-between items-center">
                    <p className="text-[10px] text-gray-500">Optional</p>
                    <p className={`text-[10px] ${
                      formData.description.length > 1800
                        ? 'text-orange-600 font-medium'
                        : 'text-gray-500'
                    }`}>
                      {formData.description.length} / 2000 characters
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Leadership */}
          <div className="bg-white border border-gray-200 rounded-sm">
            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
              <h3 className="text-xs font-medium text-gray-700 uppercase tracking-wider">Leadership</h3>
            </div>
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label htmlFor="unitHead" className="block text-xs font-medium text-gray-700 mb-1">
                    Unit Head
                  </label>
                  <input
                    type="text"
                    name="unitHead"
                    id="unitHead"
                    maxLength={255}
                    value={formData.unitHead}
                    onChange={handleChange}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                  />
                </div>

                <div>
                  <label htmlFor="unitHeadEmail" className="block text-xs font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="unitHeadEmail"
                    id="unitHeadEmail"
                    maxLength={255}
                    value={formData.unitHeadEmail}
                    onChange={handleChange}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                  />
                </div>

                <div>
                  <label htmlFor="unitHeadPhone" className="block text-xs font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="unitHeadPhone"
                    id="unitHeadPhone"
                    maxLength={50}
                    value={formData.unitHeadPhone}
                    onChange={handleChange}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Metrics */}
          <div className="bg-white border border-gray-200 rounded-sm">
            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
              <h3 className="text-xs font-medium text-gray-700 uppercase tracking-wider">Metrics</h3>
            </div>
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="employeeCount" className="block text-xs font-medium text-gray-700 mb-1">
                    Employee Count
                  </label>
                  <input
                    type="number"
                    name="employeeCount"
                    id="employeeCount"
                    min="0"
                    value={formData.employeeCount}
                    onChange={handleChange}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                  />
                </div>

                <div>
                  <label htmlFor="annualBudget" className="block text-xs font-medium text-gray-700 mb-1">
                    Annual Budget ($)
                  </label>
                  <input
                    type="number"
                    name="annualBudget"
                    id="annualBudget"
                    min="0"
                    step="0.01"
                    value={formData.annualBudget}
                    onChange={handleChange}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={handleCancel}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-sm text-gray-700 bg-white hover:bg-gray-50"
            >
              <XMarkIcon className="h-3.5 w-3.5 mr-1" />
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-sm text-white bg-gray-900 hover:bg-gray-800"
            >
              <CheckIcon className="h-3.5 w-3.5 mr-1" />
              Update Unit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

