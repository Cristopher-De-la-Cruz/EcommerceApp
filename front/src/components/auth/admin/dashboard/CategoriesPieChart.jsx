import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import { PropTypes } from "prop-types"


export const CategoriesPieChart = ({ data = [] }) => {
    const colors = ['#9AE600', '#46EDD5', '#F0B100', '#EC003F', '#E7000B'];
    const datas = data.map((item, index) => ({ ...item, fill: colors[index % colors.length] }));
    return (
        <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie
                    data={data}
                    dataKey="total_sales"
                    nameKey="nombre"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    label
                >
                    {datas.map((item) => (
                        <Cell key={`cell-${item.id}`} fill={item.fill} />
                    ))}
                </Pie>
                <Tooltip />
            </PieChart>
        </ResponsiveContainer>
    )
}

CategoriesPieChart.propTypes = {
    data: PropTypes.array,
}
