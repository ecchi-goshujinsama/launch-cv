'use client';

import * as React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Award, 
  Plus, 
  Globe, 
  Calendar, 
  Building,
  CreditCard,
  GripVertical,
  Trash2,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { LaunchButton } from '@/components/ui/launch-button';
import { MissionCard } from '@/components/layout';
import { certificationItemSchema } from '@/lib/validations/resume-schemas';
import { useResumeStore } from '@/lib/stores/resume-store';

const certificationsFormSchema = z.object({
  certifications: z.array(certificationItemSchema.extend({
    id: z.string().optional()
  }))
});

type CertificationsFormData = z.infer<typeof certificationsFormSchema>;
type CertificationEntry = CertificationsFormData['certifications'][0];

interface CertificationsFormProps {
  initialData?: CertificationEntry[];
  onSave: (data: CertificationEntry[]) => void;
  onCancel?: () => void;
  className?: string;
  autoSave?: boolean;
}

export function CertificationsForm({
  initialData = [],
  onSave,
  onCancel,
  className,
  autoSave = true
}: CertificationsFormProps) {
  const { updateResumeSection } = useResumeStore();

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isDirty, isValid }
  } = useForm<CertificationsFormData>({
    resolver: zodResolver(certificationsFormSchema) as any,
    defaultValues: {
      certifications: initialData.length > 0 ? initialData : [{
        id: crypto.randomUUID(),
        name: '',
        issuer: '',
        issueDate: '',
        expirationDate: null,
        credentialId: '',
        url: ''
      }]
    },
    mode: 'onBlur'
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'certifications'
  });

  const watchedData = watch();

  // Auto-save functionality
  React.useEffect(() => {
    if (autoSave && isDirty && isValid) {
      const timeoutId = setTimeout(() => {
        updateResumeSection('certifications', 'Certifications', watchedData.certifications);
        onSave(watchedData.certifications);
      }, 1000);

      return () => clearTimeout(timeoutId);
    }
    return undefined;
  }, [watchedData.certifications, isDirty, isValid, autoSave, onSave, updateResumeSection]);

  const handleFormSubmit = (data: CertificationsFormData) => {
    updateResumeSection('certifications', 'Certifications', data.certifications);
    onSave(data.certifications);
  };

  const addCertification = () => {
    append({
      id: crypto.randomUUID(),
      name: '',
      issuer: '',
      issueDate: '',
      expirationDate: null,
      credentialId: '',
      url: ''
    });
  };

  const removeCertification = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  // Helper to check if certification is expired
  const isExpired = (expirationDate: string | null | undefined) => {
    if (!expirationDate) return false;
    const expDate = new Date(expirationDate);
    const now = new Date();
    return expDate < now;
  };

  // Helper to check if certification expires soon (within 30 days)
  const expiresSoon = (expirationDate: string | null | undefined) => {
    if (!expirationDate) return false;
    const expDate = new Date(expirationDate);
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000));
    return expDate > now && expDate <= thirtyDaysFromNow;
  };

  const renderField = (
    name: string,
    label: string,
    type: 'text' | 'textarea' | 'url' | 'date' = 'text',
    icon?: React.ReactNode,
    placeholder?: string,
    required = false,
    rows = 3
  ) => {
    const fieldError = name.split('.').reduce((err: any, key) => err?.[key], errors);
    
    return (
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
          {icon}
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
        {type === 'textarea' ? (
          <textarea
            {...register(name as any)}
            rows={rows}
            placeholder={placeholder}
            className={cn(
              "w-full px-3 py-2 border rounded-md text-sm transition-colors resize-y",
              "focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-launch-blue-200",
              fieldError
                ? "border-red-300 bg-red-50"
                : "border-gray-300 hover:border-gray-400 focus:border-launch-blue"
            )}
          />
        ) : (
          <input
            {...register(name as any)}
            type={type}
            placeholder={placeholder}
            className={cn(
              "w-full px-3 py-2 border rounded-md text-sm transition-colors",
              "focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-launch-blue-200",
              fieldError
                ? "border-red-300 bg-red-50"
                : "border-gray-300 hover:border-gray-400 focus:border-launch-blue"
            )}
          />
        )}
        {fieldError && (
          <p className="text-xs text-red-600 flex items-center gap-1">
            <span>⚠️</span>
            {fieldError.message}
          </p>
        )}
      </div>
    );
  };

  return (
    <MissionCard variant="elevated" className={cn('', className)}>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Section Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-launch-blue/10 rounded-lg flex items-center justify-center">
              <Award className="w-5 h-5 text-launch-blue" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mission-text">Certifications</h3>
              <p className="text-sm text-gray-600">Professional certifications and credentials</p>
            </div>
          </div>
          <LaunchButton
            type="button"
            variant="outline"
            size="sm"
            onClick={addCertification}
            icon="none"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Certification
          </LaunchButton>
        </div>

        {/* Certification Entries */}
        <div className="space-y-6">
          {fields.map((field, index) => {
            const expirationDate = watchedData.certifications[index]?.expirationDate;
            const expired = isExpired(expirationDate);
            const soonExpiring = expiresSoon(expirationDate);
            
            return (
              <div key={field.id} className="relative">
                <div className={cn(
                  "p-4 border rounded-lg space-y-4 bg-white",
                  expired ? "border-red-200 bg-red-50" : 
                  soonExpiring ? "border-amber-200 bg-amber-50" : "border-gray-200"
                )}>
                  {/* Entry Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="cursor-grab active:cursor-grabbing p-1 text-gray-400 hover:text-gray-600"
                        onMouseDown={(e) => {
                          e.preventDefault();
                        }}
                      >
                        <GripVertical className="w-4 h-4" />
                      </button>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-gray-900">
                          {watchedData.certifications[index]?.name || `Certification ${index + 1}`}
                        </h4>
                        {expired && (
                          <div className="flex items-center gap-1 text-red-600 text-xs">
                            <AlertTriangle className="w-3 h-3" />
                            <span>Expired</span>
                          </div>
                        )}
                        {soonExpiring && !expired && (
                          <div className="flex items-center gap-1 text-amber-600 text-xs">
                            <Clock className="w-3 h-3" />
                            <span>Expires Soon</span>
                          </div>
                        )}
                      </div>
                    </div>
                    {fields.length > 1 && (
                      <LaunchButton
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCertification(index)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </LaunchButton>
                    )}
                  </div>

                  {/* Main Fields Grid */}
                  <div className="grid md:grid-cols-2 gap-4">
                    {renderField(
                      `certifications.${index}.name`,
                      'Certification Name',
                      'text',
                      <Award className="w-4 h-4" />,
                      'AWS Certified Solutions Architect',
                      true
                    )}
                    {renderField(
                      `certifications.${index}.issuer`,
                      'Issuing Organization',
                      'text',
                      <Building className="w-4 h-4" />,
                      'Amazon Web Services',
                      true
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    {renderField(
                      `certifications.${index}.issueDate`,
                      'Issue Date',
                      'text',
                      <Calendar className="w-4 h-4" />,
                      'March 2023',
                      true
                    )}
                    {renderField(
                      `certifications.${index}.expirationDate`,
                      'Expiration Date',
                      'text',
                      <Clock className="w-4 h-4" />,
                      'March 2026 (or leave blank if no expiration)'
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    {renderField(
                      `certifications.${index}.credentialId`,
                      'Credential ID',
                      'text',
                      <CreditCard className="w-4 h-4" />,
                      'ABC123-DEF456-GHI789'
                    )}
                    {renderField(
                      `certifications.${index}.url`,
                      'Verification URL',
                      'url',
                      <Globe className="w-4 h-4" />,
                      'https://verify.example.com/credential/123'
                    )}
                  </div>

                  {/* Expiration Warning */}
                  {expired && (
                    <div className="p-3 bg-red-100 border border-red-200 rounded-md">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5" />
                        <div className="text-sm text-red-800">
                          <p className="font-medium">This certification has expired</p>
                          <p>Consider updating your expiration date or removing this certification if it&apos;s no longer valid.</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {soonExpiring && !expired && (
                    <div className="p-3 bg-amber-100 border border-amber-200 rounded-md">
                      <div className="flex items-start gap-2">
                        <Clock className="w-4 h-4 text-amber-600 mt-0.5" />
                        <div className="text-sm text-amber-800">
                          <p className="font-medium">This certification expires soon</p>
                          <p>Consider renewing this certification to maintain its validity.</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Tips Section */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
            <span>💡</span>
            Certifications Section Tips
          </h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• List only relevant, current certifications for your target role</li>
            <li>• Include both technical and professional certifications</li>
            <li>• Add verification links when available to build credibility</li>
            <li>• Keep expired certifications only if they&apos;re still relevant</li>
            <li>• Consider adding certification scores if they&apos;re impressive</li>
          </ul>
        </div>

        {/* Auto-save Status */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            {autoSave ? (
              isDirty ? (
                <>
                  <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
                  Auto-saving changes...
                </>
              ) : (
                <>
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  All changes saved
                </>
              )
            ) : (
              <>
                <div className="w-2 h-2 bg-gray-400 rounded-full" />
                Auto-save disabled
              </>
            )}
          </div>

          {/* Manual Save Buttons */}
          {!autoSave && (
            <div className="flex gap-3">
              {onCancel && (
                <LaunchButton
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={onCancel}
                >
                  Cancel
                </LaunchButton>
              )}
              <LaunchButton
                type="submit"
                variant="mission"
                size="sm"
                disabled={!isDirty || !isValid}
                icon="rocket"
                iconPosition="right"
              >
                Save Changes
              </LaunchButton>
            </div>
          )}
        </div>
      </form>
    </MissionCard>
  );
}