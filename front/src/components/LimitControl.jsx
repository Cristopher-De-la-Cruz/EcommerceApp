
import { PropTypes } from 'prop-types'
import Cookies from 'js-cookie'

export const LimitControl = ({limit, setLimit, values=[12, 18, 24, 30, 36]}) => {

    const changeLimit = (value) => {
        setLimit(value);
        Cookies.set('limite', value);
    }
    
    return (
        <div className="flex gap-2 items-center">
            <p className="text-lg font-semibold">Viendo: </p>
            <select className="border-2 py-1 px-2 rounded-md"
                defaultValue={limit}
                onChange={(e) => changeLimit(e.target.value)}>
                {values.map((limit) => (
                    <option
                        key={limit}
                        className="bg-slate-100 text-black dark:bg-zinc-900 dark:text-white"
                    >
                        {limit}
                    </option>
                ))}
            </select>
        </div>
    )
}

LimitControl.propTypes = {
    limit: PropTypes.number,
    setLimit: PropTypes.func,
    values: PropTypes.array,
}