'use client';

import React from 'react';
import Form from '@rjsf/core';
import { RJSFSchema, UiSchema, FormContextType, ErrorSchema, FieldTemplateProps } from '@rjsf/utils';
import validator from '@rjsf/validator-ajv8';
import { cn } from '@/lib/utils';

interface JSONSchemaFormProps {
  schema: RJSFSchema;
  uiSchema?: UiSchema;
  formData?: any;
  onChange?: (data: any) => void;
  onSubmit?: (data: any) => void;
  onError?: (errors: any) => void;
  className?: string;
  disabled?: boolean;
  readonly?: boolean;
  liveValidate?: boolean;
  showErrorList?: boolean;
  noHtml5Validate?: boolean;
  formContext?: FormContextType;
  customTemplates?: {
    FieldTemplate?: React.ComponentType<FieldTemplateProps>;
  };
}

export const JSONSchemaForm: React.FC<JSONSchemaFormProps> = ({
  schema,
  uiSchema = {},
  formData,
  onChange,
  onSubmit,
  onError,
  className = '',
  disabled = false,
  readonly = false,
  liveValidate = true,
  showErrorList = true,
  noHtml5Validate = false,
  formContext,
  customTemplates = {}
}) => {
  const handleSubmit = ({ formData }: any) => {
    onSubmit?.(formData);
  };

  const handleChange = ({ formData }: any) => {
    onChange?.(formData);
  };

  const handleError = (errors: ErrorSchema) => {
    onError?.(errors);
  };

  return (
    <div className={cn('json-schema-form', className)}>
      <Form
        schema={schema}
        uiSchema={uiSchema}
        formData={formData}
        validator={validator}
        onChange={handleChange}
        onSubmit={handleSubmit}
        onError={handleError}
        disabled={disabled}
        readonly={readonly}
        liveValidate={liveValidate}
        showErrorList={showErrorList}
        noHtml5Validate={noHtml5Validate}
        formContext={formContext}
        templates={customTemplates}
        className="rjsf-form"
      />
    </div>
  );
};

export default JSONSchemaForm;