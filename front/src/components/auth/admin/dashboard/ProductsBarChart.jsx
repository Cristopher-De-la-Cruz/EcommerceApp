import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { PropTypes } from "prop-types"


export const ProductsBarChart = ({ data = [] }) => {
    const truncate = (text, maxLength) => {
        return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
    };

    return (
        <ResponsiveContainer width="100%" height="100%" >
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="nombre"
                    tickFormatter={(value) => truncate(value, 10)}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar onClick={() => console.log('Mes')} dataKey="ingreso" fill="#00BBA7" />
            </BarChart>
        </ResponsiveContainer>
    )
}

ProductsBarChart.propTypes = {
    data: PropTypes.array,
}