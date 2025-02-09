import { RadialBar, RadialBarChart, ResponsiveContainer } from "recharts";
import PropTypes from "prop-types";

export const Progress = ({ currentIncome, targetIncome }) => {
    const safeCurrentIncome = isNaN(currentIncome) ? 0 : currentIncome;
    const safeTargetIncome = isNaN(targetIncome) ? 0 : targetIncome;

    const progress = safeTargetIncome > 0 ? Math.min((safeCurrentIncome / safeTargetIncome) * 100, 100) : 0;


    const data = [{ name: "Progreso", value: progress, fill: "#6E11B0" }];

    return (
        <div className="w-100 h-100 relative text-black dark:text-white">
            <ResponsiveContainer>
                <RadialBarChart
                    cx="50%"
                    cy="50%"
                    innerRadius="45%"
                    outerRadius="100%"
                    startAngle={90}
                    endAngle={90 + (progress * 3.6)}
                    barSize={20}
                    data={data}
                >
                    <RadialBar
                        dataKey="value"
                        background={{ fill: "#e0e0e0" }}
                        clockWise
                    />
                </RadialBarChart>
            </ResponsiveContainer>
            <div
                style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    textAlign: "center",
                }}
            >
                <p style={{ fontSize: "20px", fontWeight: "bold", margin: 0 }}>
                    {`${currentIncome} / ${targetIncome}`}
                </p>
                <p style={{ fontSize: "16px", color: "#6E11B0", margin: 0 }}>
                    {`${progress.toFixed(1)}%`}
                </p>
            </div>
        </div>
    );
};

Progress.propTypes = {
    currentIncome: PropTypes.number,
    targetIncome: PropTypes.number,
};
