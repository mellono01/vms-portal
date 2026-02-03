// DTO
import type { Form } from '@/lib/dto/Form.dto'; 

// Constants
import { 
  emailRegex, 
  phoneRegex, 
  wwccRegex 
} from '@/app/lib/constants/constants';

export function isWwccRequired(formTypeId: string): boolean {
  if ( 
    formTypeId !== process.env.VITE_FORM_TYPES_VOLUNTEEREXEMPT &&
    formTypeId !== process.env.VITE_FORM_TYPES_CONTRACTOREXEMPT &&
    formTypeId !== process.env.VITE_FORM_STATUS_UNDER18
  ) return true;
  return false;
}

export function isDetailsValid({
  formData,
  wwccRequired
}: {
  formData: Form | null;
  wwccRequired: boolean;
}): boolean {
  let validPhone = phoneRegex.test(formData?.PhoneNumber || '');
  let validEmail = emailRegex.test(formData?.EmailAddress || '');
  let validWWCC = wwccRegex.test(formData?.WwccNumber || '');
  let validWWCCExpiry = (
    formData?.WwccExpiryDate !== undefined && 
    formData?.WwccExpiryDate !== null && 
    formData?.WwccExpiryDate !== ""
  ) ? true : false;

  if (wwccRequired && validPhone && validEmail && validWWCC && validWWCCExpiry) { // Clearance requires WWCC, check for it
    return true;
  } else if (!wwccRequired && validPhone && validEmail ) { // Clearance does not require WWCC, dont check for it
    return true;
  } else {
    return false;
  }
}

export function getStatusHelperText(
  formData: Form | null, 
  selectedForm: Form | null
) {
    if(
      formData?.WwccNumber !== selectedForm?.WwccNumber || 
      formData?.WwccExpiryDate !== selectedForm?.WwccExpiryDate
    ) {
      let text = 'You have updated your WWCC details which will set your clearance status to "Renewing". ';
      switch (selectedForm?.FormStatus?.id) {
        case process.env.NEXT_PUBLIC_FORM_STATUS_CLEARED:
        case process.env.NEXT_PUBLIC_FORM_STATUS_UNDER18:
          text += 'As your clearance is currently valid, you will be able to continue using it while we review your updated details.';
          return text;
        case process.env.NEXT_PUBLIC_FORM_STATUS_APPLIED:
        case process.env.NEXT_PUBLIC_FORM_STATUS_RENEWING:
        case process.env.NEXT_PUBLIC_FORM_STATUS_INPROGRESS:
          text += 'As your clearance is currently waiting for review, you will still need to wait until your updated details have been reviewed and approved.';
          return text;
        case process.env.NEXT_PUBLIC_FORM_STATUS_EXPIRING:
          text += 'As your clearance is expiring soon, you will be able to continue using it until it expires while we review your updated details.';
          return text;
        case process.env.NEXT_PUBLIC_FORM_STATUS_DECLINED:
        case process.env.NEXT_PUBLIC_FORM_STATUS_CLOSED:
        case process.env.NEXT_PUBLIC_FORM_STATUS_EXPIRED:
        case process.env.NEXT_PUBLIC_FORM_STATUS_BARRED:
        case process.env.NEXT_PUBLIC_FORM_STATUS_INTERIMBARRED:
        case process.env.NEXT_PUBLIC_FORM_STATUS_CLOSEDBYOCG:
          text += 'As your clearance is currently not valid, you will not be able to use it until your updated details have been reviewed and approved.';
          return text;
      }
    }
  }