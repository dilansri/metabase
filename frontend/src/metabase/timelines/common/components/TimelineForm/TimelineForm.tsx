import React, { useMemo } from "react";
import { t } from "ttag";
import * as Yup from "yup";
import { getTimelineIcons } from "metabase/lib/timelines";
import Button from "metabase/core/components/Button";
import Form from "metabase/core/components/Form";
import FormProvider from "metabase/core/components/FormProvider";
import FormInput from "metabase/core/components/FormInput";
import FormTextArea from "metabase/core/components/FormTextArea";
import FormSelect from "metabase/core/components/FormSelect";
import FormSubmitButton from "metabase/core/components/FormSubmitButton";
import FormErrorMessage from "metabase/core/components/FormErrorMessage";
import { TimelineData } from "metabase-types/api";
import FormArchiveButton from "../FormArchiveButton";
import { TimelineFormFooter } from "./TimelineForm.styled";

const TimelineSchema = Yup.object({
  name: Yup.string()
    .required(t`required`)
    .max(255, ({ max }) => t`must be ${max} characters or less`),
  description: Yup.string().max(
    255,
    ({ max }) => t`must be ${max} characters or less`,
  ),
  icon: Yup.string().required(t`required`),
});

export interface TimelineFormProps {
  initialValues: TimelineData;
  onSubmit: (data: TimelineData) => void;
  onArchive?: () => void;
  onCancel?: () => void;
}

const TimelineForm = ({
  initialValues,
  onSubmit,
  onArchive,
  onCancel,
}: TimelineFormProps) => {
  const isNew = initialValues.id == null;
  const icons = useMemo(() => getTimelineIcons(), []);

  return (
    <FormProvider
      initialValues={initialValues}
      validationSchema={TimelineSchema}
      onSubmit={onSubmit}
    >
      {({ dirty }) => (
        <Form disabled={!dirty}>
          <FormInput
            name="name"
            title={t`Name`}
            placeholder={t`Product releases`}
            autoFocus
            fullWidth
          />
          <FormTextArea name="description" title={t`Description`} fullWidth />
          <FormSelect name="icon" title={t`Default icon`} options={icons} />
          <TimelineFormFooter>
            <FormErrorMessage inline />
            {!isNew && (
              <FormArchiveButton onClick={onArchive}>
                {t`Archive timeline and all events`}
              </FormArchiveButton>
            )}
            <Button type="button" onClick={onCancel}>
              {t`Cancel`}
            </Button>
            <FormSubmitButton
              title={isNew ? t`Create` : t`Update`}
              disabled={!dirty}
              primary
            />
          </TimelineFormFooter>
        </Form>
      )}
    </FormProvider>
  );
};

export default TimelineForm;
