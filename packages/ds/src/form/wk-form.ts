import { LionFieldset } from '@lion/ui/fieldset.js';
import { LionForm } from '@lion/ui/form.js';

/**
 * Form wrapper built on LionForm. Contains a native `<form>`. Its `submit` event
 * reports an attempt, including invalid Lion fields; it does not certify valid data
 * or perform a network submission. Consumers guard validation and external errors.
 * Reset restores registered Lion fields to their defaults and clears interaction
 * state. Fields using WkScalarFieldMixin also clear their external error.
 *
 * @tag wk-form
 */
export class WkForm extends LionForm {}

/**
 * Grouped fields with an accessible group name (the `label` slot or attribute), built on
 * LionFieldset.
 *
 * @tag wk-fieldset
 */
export class WkFieldset extends LionFieldset {}
