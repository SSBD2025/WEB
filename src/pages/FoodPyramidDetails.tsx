import NutrientBadge from "@/components/shared/NutritionBadge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import ROUTES from "@/constants/routes";
import { useGetFoodPyramid } from "@/hooks/useGetFoodPyramid";
import { motion } from "framer-motion";
import { t } from "i18next";
import { ArrowLeft, MessageSquare, Pill, Star, User, Zap } from "lucide-react";
import { Link, useParams } from "react-router";
import { useTranslation } from "react-i18next"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

const FoodPyramidDetails = () => {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const { data, isLoading } = useGetFoodPyramid(id ?? "");
  const { i18n } = useTranslation();


  if (isLoading) {
    return (
      <main className="flex-grow flex justify-center items-center">
        <Spinner />
      </main>
    );
  }

  return (
    <main className="container mx-auto py-8 px-4 flex-grow">
      <motion.div
        className="space-y-8"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants} className="flex items-center gap-4">
          <Link to={ROUTES.FOOD_PYRAMIDS}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
                {t("food_pyramids_detail.go_back", "Go back")}
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">
            {t("food_pyramids_detail.name", "Pyramid name")} {data?.foodPyramid.name}
          </h1>
          <div className="flex items-center ml-auto">
            <Star className="h-5 w-5 text-yellow-500 mr-1" />
            <span className="font-medium">
              {data?.foodPyramid.averageRating}
            </span>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Pill className="h-5 w-5 text-orange-500" />
                {t("food_pyramids_detail.vitamins", "Vitamins")}
              </CardTitle>
              <CardDescription>
                {t(
                  "food_pyramids_detail.vitamins_description",
                  "Essential vitamins provided by this food pyramid"
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                <NutrientBadge
                  label="A"
                  value={data?.foodPyramid.a || 0}
                  unit="mg"
                  color="secondary"
                />
                <NutrientBadge
                  label="D"
                  value={data?.foodPyramid.d || 0}
                  unit="mg"
                  color="secondary"
                />
                <NutrientBadge
                  label="E"
                  value={data?.foodPyramid.e || 0}
                  unit="mg"
                  color="secondary"
                />
                <NutrientBadge
                  label="K"
                  value={data?.foodPyramid.k || 0}
                  unit="mg"
                  color="secondary"
                />
                <NutrientBadge
                  label="C"
                  value={data?.foodPyramid.c || 0}
                  unit="mg"
                  color="secondary"
                />
                <NutrientBadge
                  label="B1"
                  value={data?.foodPyramid.b1 || 0}
                  unit="mg"
                  color="outline"
                />
                <NutrientBadge
                  label="B2"
                  value={data?.foodPyramid.b2 || 0}
                  unit="mg"
                  color="outline"
                />
                <NutrientBadge
                  label="B3"
                  value={data?.foodPyramid.b3 || 0}
                  unit="mg"
                  color="outline"
                />
                <NutrientBadge
                  label="B5"
                  value={data?.foodPyramid.b5 || 0}
                  unit="mg"
                  color="outline"
                />
                <NutrientBadge
                  label="B6"
                  value={data?.foodPyramid.b6 || 0}
                  unit="mg"
                  color="outline"
                />
                <NutrientBadge
                  label="B7"
                  value={data?.foodPyramid.b7 || 0}
                  unit="mg"
                  color="outline"
                />
                <NutrientBadge
                  label="B9"
                  value={data?.foodPyramid.b9 || 0}
                  unit="mg"
                  color="outline"
                />
                <NutrientBadge
                  label="B12"
                  value={data?.foodPyramid.b12 || 0}
                  unit="mg"
                  color="outline"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-blue-500" />
                {t("food_pyramids_detail.minerals", "Minerals")}
              </CardTitle>
              <CardDescription>
                {t(
                  "food_pyramids_detail.minerals_description",
                  "Essential minerals provided by this food pyramid"
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                <NutrientBadge
                  label="K"
                  value={data?.foodPyramid.potassium || 0}
                  unit="mg"
                  color="default"
                />
                <NutrientBadge
                  label="Ca"
                  value={data?.foodPyramid.calcium || 0}
                  unit="mg"
                  color="default"
                />
                <NutrientBadge
                  label="P"
                  value={data?.foodPyramid.phosphorus || 0}
                  unit="mg"
                  color="default"
                />
                <NutrientBadge
                  label="Mg"
                  value={data?.foodPyramid.magnesium || 0}
                  unit="mg"
                  color="default"
                />
                <NutrientBadge
                  label="Fe"
                  value={data?.foodPyramid.iron || 0}
                  unit="mg"
                  color="destructive"
                />
                <NutrientBadge
                  label="Zn"
                  value={data?.foodPyramid.zinc || 0}
                  unit="mg"
                  color="destructive"
                />
                <NutrientBadge
                  label="F"
                  value={data?.foodPyramid.fluorine || 0}
                  unit="mg"
                  color="destructive"
                />
                <NutrientBadge
                  label="Mn"
                  value={data?.foodPyramid.manganese || 0}
                  unit="mg"
                  color="destructive"
                />
                <NutrientBadge
                  label="Cu"
                  value={data?.foodPyramid.copper || 0}
                  unit="mg"
                  color="destructive"
                />
                <NutrientBadge
                  label="I"
                  value={data?.foodPyramid.iodine || 0}
                  unit="mg"
                  color="destructive"
                />
                <NutrientBadge
                  label="Se"
                  value={data?.foodPyramid.selenium || 0}
                  unit="mg"
                  color="destructive"
                />
                <NutrientBadge
                  label="Mo"
                  value={data?.foodPyramid.molybdenum || 0}
                  unit="mg"
                  color="destructive"
                />
                <NutrientBadge
                  label="Cr"
                  value={data?.foodPyramid.chromium || 0}
                  unit="mg"
                  color="destructive"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
              {t("food_pyramids_detail.client_feedbacks", "Client Feedbacks")}
          </h2>
          <div className="space-y-4">
            {data?.feedbacks && data.feedbacks.length > 0 ? (
              data.feedbacks.map((feedback) => {
                const client = data.clients.find((c) => c.id === feedback.clientId)

                return (
                  <Card key={feedback.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>
                            {client ? `${client.firstName[0]}${client.lastName[0]}` : "?"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">
                                {client ? `${client.firstName} ${client.lastName}` : "Unknown user"}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                {new Date(feedback.timestamp).toLocaleDateString(
                                  i18n.language === "pl" ? "pl-PL" : "en-US",
                                  {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  },
                                )}
                              </p>
                            </div>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < feedback.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
                                  }`}
                                />
                              ))}
                              <span className="ml-2 text-sm font-medium">{feedback.rating}/5</span>
                            </div>
                          </div>
                          <p className="text-sm leading-relaxed">{feedback.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground">{t("food_pyramids_detail.no_client_feedbacks", "Client Feedbacks")}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <User className="h-5 w-5" />
              {t("food_pyramids_detail.assigned_clients", "Clients assigned to pyramid")}
          </h2>
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data?.clients.map((client) => (
                  <div
                    className="flex items-center gap-3 p-3 rounded-lg border"
                    key={client.email}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {client.firstName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="text-medium">
                        {client.firstName} {client.lastName}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {client.email}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </main>
  );
};

export default FoodPyramidDetails;
