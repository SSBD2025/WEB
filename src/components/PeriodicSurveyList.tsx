import {GetPeriodicSurvey} from "@/types/periodic_survey";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { motion } from "framer-motion";
import {t} from "i18next"
import {useEffect, useState} from "react";

const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
        opacity: 1,
        x: 0,
        transition: {
            delay: i * 0.05,
            duration: 0.3,
        },
    }),
};

const PeriodicSurveyList = ({surveys}: {
    surveys?: GetPeriodicSurvey[];

}) => {
    const [timezone, setTimezone] = useState<string>();

    useEffect(() => {
        const storedTz =
            localStorage.getItem("user-timezone") ||
            Intl.DateTimeFormat().resolvedOptions().timeZone;
        setTimezone(storedTz);
    }, []);

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>
                        {t("periodic_survey.list.table.head.measurement_date")}
                    </TableHead>
                    <TableHead>
                        {t("periodic_survey.list.table.head.weight")}
                    </TableHead>
                    <TableHead>
                        {t("periodic_survey.list.table.head.blood_pressure")}
                    </TableHead>
                    <TableHead>
                        {t("periodic_survey.list.table.head.blood_sugar_level")}
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {surveys?.map((survey: GetPeriodicSurvey, i) => {
                    return (
                        <motion.tr
                            key={i}
                            custom={i}
                            initial="hidden"
                            animate="visible"
                            variants={rowVariants}
                        >
                            <TableCell>
                                <div className="font-medium">
                                    {new Intl.DateTimeFormat("pl-PL", {
                                        timeZone: timezone,
                                        year: "numeric",
                                        month: "2-digit",
                                        day: "2-digit",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: false,
                                    }).format(new Date(survey.measurementDate))}
                                </div>
                            </TableCell>
                            <TableCell className="font-medium">
                                <div className="font-medium">{survey.weight}</div>
                            </TableCell>
                            <TableCell className="font-medium">
                                <div className="font-medium">{survey.bloodPressure}</div>
                            </TableCell>
                            <TableCell className="font-medium">
                                <div className="font-medium">{survey.bloodSugarLevel}</div>
                            </TableCell>
                        </motion.tr>
                    )
                })}
            </TableBody>
        </Table>
    )
}

export default PeriodicSurveyList;