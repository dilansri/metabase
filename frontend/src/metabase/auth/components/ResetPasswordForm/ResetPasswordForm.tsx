import React, { useMemo } from "react";
import { t } from "ttag";
import * as Yup from "yup";
import _ from "underscore";
import MetabaseSettings from "metabase/lib/settings";
import Form from "metabase/core/components/Form";
import FormProvider from "metabase/core/components/FormProvider";
import FormInput from "metabase/core/components/FormInput";
import FormSubmitButton from "metabase/core/components/FormSubmitButton";
import FormErrorMessage from "metabase/core/components/FormErrorMessage";
import { ResetPasswordData } from "metabase/auth/types";
import {
  PasswordFormMessage,
  PasswordFormTitle,
} from "./ResetPasswordForm.styled";

const ResetPasswordSchema = Yup.object({
  password: Yup.string()
    .required(t`required`)
    .test(async (value = "", context) => {
      const error = await context.options.context?.onValidatePassword(value);
      return error ? context.createError({ message: error }) : true;
    }),
  password_confirm: Yup.string()
    .required(t`required`)
    .oneOf([Yup.ref("password")], t`passwords do not match`),
});

interface ResetPasswordFormProps {
  onValidatePassword: (password: string) => Promise<string | undefined>;
  onSubmit: (data: ResetPasswordData) => void;
}

const ResetPasswordForm = ({
  onValidatePassword,
  onSubmit,
}: ResetPasswordFormProps): JSX.Element => {
  const initialValues = useMemo(
    () => ({ password: "", password_confirm: "" }),
    [],
  );

  const passwordDescription = useMemo(
    () => MetabaseSettings.passwordComplexityDescription(),
    [],
  );

  const validationContext = useMemo(
    () => ({ onValidatePassword: _.memoize(onValidatePassword) }),
    [onValidatePassword],
  );

  return (
    <div>
      <PasswordFormTitle>{t`New password`}</PasswordFormTitle>
      <PasswordFormMessage>
        {t`To keep your data secure, passwords ${passwordDescription}`}
      </PasswordFormMessage>
      <FormProvider
        initialValues={initialValues}
        validationSchema={ResetPasswordSchema}
        validationContext={validationContext}
        onSubmit={onSubmit}
      >
        <Form>
          <FormInput
            name="password"
            type="password"
            title={t`Create a password`}
            placeholder={t`Shhh...`}
            autoComplete="new-password"
            autoFocus
            fullWidth
          />
          <FormInput
            name="password_confirm"
            type="password"
            title={t`Confirm your password`}
            placeholder={t`Shhh... but one more time so we get it right`}
            autoComplete="new-password"
            fullWidth
          />
          <FormSubmitButton title={t`Save new password`} primary fullWidth />
          <FormErrorMessage />
        </Form>
      </FormProvider>
    </div>
  );
};

export default ResetPasswordForm;
