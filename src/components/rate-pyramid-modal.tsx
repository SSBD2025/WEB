import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { RequiredFormLabel } from "./ui/requiredLabel";
import { StarRating } from "./ui/star-rating";
import { useTranslation } from "react-i18next";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useAddFeedback, useUpdateFeedback } from "@/hooks/useAddFeedback";
import { Feedback } from "@/types/food_pyramid";
import { useEffect } from "react";

const RatePyramidModal = ({
  isOpen,
  onClose,
  pyramidId,
  existingFeedback,
}: {
  isOpen: boolean;
  onClose: () => void;
  pyramidId: string;
  existingFeedback?: Feedback;
}) => {
  const { t } = useTranslation();

  const { mutate } = useAddFeedback(pyramidId);
  const { mutate: updateMutate } = useUpdateFeedback(pyramidId);

  const pyramidFeedbackSchema = z.object({
    rating: z
      .number()
      .min(1, t("client_food_pyramid_list.feedback_modal.rating_required"))
      .max(5),
    description: z
      .string()
      .min(
        1,
        t("client_food_pyramid_list.feedback_modal.description_required")
      ),
  });

  type PyramidFeedbackFormValues = z.infer<typeof pyramidFeedbackSchema>;

  const form = useForm<PyramidFeedbackFormValues>({
    resolver: zodResolver(pyramidFeedbackSchema),
    defaultValues: {
      rating: existingFeedback ? existingFeedback.rating : 0,
      description: existingFeedback ? existingFeedback.description : "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        rating: existingFeedback ? existingFeedback.rating : 0,
        description: existingFeedback ? existingFeedback.description : "",
      })
    }
  }, [isOpen, existingFeedback, form])

  const { isSubmitting } = form.formState;

  const onSubmit = async (data: PyramidFeedbackFormValues) => {
    if (existingFeedback) {
      const updatedFeedback: Feedback = {
        ...existingFeedback,
        rating: data.rating,
        description: data.description,
      };

      updateMutate({
        data: updatedFeedback,
      });
    } else {
      mutate({
        id: pyramidId,
        data,
      });
    }
    handleClose();
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            {existingFeedback
              ? t("client_food_pyramid_list.feedback_modal.edit_title")
              : t("client_food_pyramid_list.feedback_modal.title")}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <RequiredFormLabel>
                    {t("client_food_pyramid_list.feedback_modal.star_label")}
                  </RequiredFormLabel>
                  <FormControl>
                    <StarRating<PyramidFeedbackFormValues, "rating">
                      name="rating"
                      control={form.control}
                    />
                  </FormControl>
                  <FormMessage />
                  {field.value > 0 && (
                    <div className="text-center text-sm text-muted-foreground">
                      {field.value}/5
                    </div>
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <RequiredFormLabel>
                    {t(
                      "client_food_pyramid_list.feedback_modal.description_label"
                    )}
                  </RequiredFormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t(
                        "client_food_pyramid_list.feedback_modal.description_placeholder"
                      )}
                      className="resize-none"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="sm:justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                {t("common.cancel")}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? t("common.submitting") : existingFeedback ? t("common.update") : t("common.submit")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default RatePyramidModal;
