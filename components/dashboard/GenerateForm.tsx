"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

const formSchema = z.object({
  productName: z.string().min(2, "Product name is required."),
  description: z.string().min(10, "Description is required."),
  features: z.array(z.string().min(2, "Feature cannot be empty.")).min(1),
  targetAudience: z.string().min(2, "Target audience is required."),
  price: z.string().min(1, "Price is required."),
  usps: z.string().min(5, "Unique selling points are required."),
  image: z.any().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function GenerateForm() {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productName: "",
      description: "",
      features: [""],
      targetAudience: "",
      price: "",
      usps: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "features",
  });

  const onSubmit = handleSubmit(async (values) => {
    setErrorMessage(null);
    let uploadedImageUrl: string | null = null;

    const imageFile = values.image?.[0] as File | undefined;
    if (imageFile) {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", imageFile);

      const response = await fetch("/api/blob", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = (await response.json()) as { url: string };
        uploadedImageUrl = data.url;
        setImageUrl(data.url);
      }

      setUploading(false);
    }

    setIsGenerating(true);
    const response = await fetch("/api/generate-page", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productName: values.productName,
        description: values.description,
        features: values.features,
        targetAudience: values.targetAudience,
        price: values.price,
        usps: values.usps,
        imageUrl: uploadedImageUrl,
        templateStyle: "Shopify Dark",
      }),
    });

    if (!response.ok) {
      setErrorMessage("Generation failed. Please try again.");
      setIsGenerating(false);
      return;
    }

    const data = (await response.json()) as { id: string };
    router.push(`/dashboard/page/${data.id}`);
  });

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-3">
          <label className="text-[16px] font-medium text-shopify-white">
            Product or service name
          </label>
          <Input placeholder="Aurora analytics" {...register("productName")} />
          {errors.productName && (
            <p className="text-[14px] text-neon">{errors.productName.message}</p>
          )}
        </div>
        <div className="space-y-3">
          <label className="text-[16px] font-medium text-shopify-white">
            Target audience
          </label>
          <Input placeholder="Indie ecommerce founders" {...register("targetAudience")} />
          {errors.targetAudience && (
            <p className="text-[14px] text-neon">
              {errors.targetAudience.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-[16px] font-medium text-shopify-white">
          Product description
        </label>
        <Textarea
          rows={5}
          placeholder="Describe the product or service you want to sell."
          {...register("description")}
        />
        {errors.description && (
          <p className="text-[14px] text-neon">{errors.description.message}</p>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-[16px] font-medium text-shopify-white">
            Key features
          </label>
          <Button
            type="button"
            variant="secondary"
            onClick={() => append("")}
          >
            Add feature
          </Button>
        </div>
        <div className="space-y-3">
          {fields.map((field, index) => (
            <div key={field.id} className="flex flex-col gap-2 sm:flex-row">
              <Input
                placeholder={`Feature ${index + 1}`}
                {...register(`features.${index}` as const)}
              />
              <Button
                type="button"
                variant="secondary"
                onClick={() => remove(index)}
                className="sm:w-32"
              >
                Remove
              </Button>
            </div>
          ))}
        </div>
        {errors.features && (
          <p className="text-[14px] text-neon">Add at least one feature.</p>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-3">
          <label className="text-[16px] font-medium text-shopify-white">
            Price
          </label>
          <Input placeholder="$299" {...register("price")} />
          {errors.price && (
            <p className="text-[14px] text-neon">{errors.price.message}</p>
          )}
        </div>
        <div className="space-y-3">
          <label className="text-[16px] font-medium text-shopify-white">
            Optional product image
          </label>
          <input
            type="file"
            accept="image/*"
            {...register("image")}
            className="w-full rounded-sm border border-shade-70 bg-dark-forest px-4 py-3 text-[14px] text-shopify-white file:mr-4 file:rounded-pill file:border-0 file:bg-shopify-white file:px-4 file:py-2 file:text-shopify-black file:font-medium"
          />
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Uploaded product"
              className="mt-3 h-32 w-32 rounded-md object-cover"
            />
          )}
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-[16px] font-medium text-shopify-white">
          Unique selling points
        </label>
        <Textarea
          rows={4}
          placeholder="List the differentiators and proof points."
          {...register("usps")}
        />
        {errors.usps && (
          <p className="text-[14px] text-neon">{errors.usps.message}</p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" disabled={uploading || isGenerating}>
          {uploading || isGenerating ? "Generating..." : "Generate Sales Page"}
        </Button>
        <p className="text-[14px] text-muted">
          Your data is securely saved and tied to your account.
        </p>
      </div>

      {isGenerating && (
        <div className="rounded-md border border-dark-card-border bg-deep-teal px-4 py-3 text-[14px] text-neon shadow-card">
          Generating your sales page. This usually takes a few seconds.
        </div>
      )}

      {errorMessage && (
        <div className="rounded-md border border-dark-card-border bg-deep-teal px-4 py-3 text-[14px] text-neon shadow-card">
          {errorMessage}
        </div>
      )}
    </form>
  );
}
