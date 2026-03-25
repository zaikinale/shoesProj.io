import { useState, useMemo } from 'react';

export const useGoodsFilters = (goods) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOrder, setSortOrder] = useState('original');

    const filteredAndSortedGoods = useMemo(() => {
        let result = goods.filter(item => 
            item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description?.toLowerCase().includes(searchQuery.toLowerCase())
        );

        if (sortOrder === 'alphabet') {
            result.sort((a, b) => a.title.localeCompare(b.title));
        }
        return result;
    }, [goods, searchQuery, sortOrder]);

    return {
        searchQuery,
        setSearchQuery,
        sortOrder,
        setSortOrder,
        filteredAndSortedGoods
    };
};