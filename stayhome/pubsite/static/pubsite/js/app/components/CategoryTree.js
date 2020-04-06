import React, { useState, useContext } from 'react';

import { SearchContext } from './Filters';


const ChildItem = props => {

    const searchContext = useContext(SearchContext);

    const selected = (searchContext.filters.category == props.pk);

    const selectCategory = (e) => {
        e.preventDefault();
        if (selected) {
            searchContext.setFilters.setCategory(null);
        } else {
            searchContext.setFilters.setCategory(props.pk);
        }
    }

    // Select class
    const selectClass = (selected) ? " selected" : ""

    return(
        <li className={"sh-child-c px-4 py-2 border-bottom" + selectClass } onClick={ selectCategory }>{props.name}</li>
    )

}

const ParentItem = props => {

    const searchContext = useContext(SearchContext);
    const pk = parseInt(props.pk);

    const selected = (searchContext.filters.category == pk);

    const selectCategory = (e) => {
        e.preventDefault();
        if (selected) {
            searchContext.setFilters.setCategory(0);
        } else {
            searchContext.setFilters.setCategory(pk);
        }
    }

    // Children
    var children = [];
    const children_keys = Object.keys(props.children);

    // If we are selected, show the children
    if (selected) {
        children = children_keys.map((child_id) => 
            <ChildItem key={child_id} name={props.children[child_id]} pk={child_id} />
        )
    }

    // If one of the child is selected, hide the others
    else if (children_keys.includes(searchContext.filters.category.toString())) {
        const child_id = searchContext.filters.category;
        children = [
            <ChildItem key={child_id} name={props.children[child_id]} pk={child_id} />
        ]
    }

    // Select class
    const selectClass = selected ? " selected" : ""

    return(
        <>
        <li className={"sh-parent-c px-3 py-2 border-bottom" + selectClass} onClick={ selectCategory }>{props.name}</li>
        {(children.length > 0) && 
        <ul className="sh-child-tree">
            {children}
        </ul>
        }
        </>
    )

}

const CategoryTree = props => {

    const categories = props.categories;

    const keys = Object.keys(categories);
    const parents = keys.map((parent_id) => 
        <ParentItem key={parent_id.toString()} name={categories[parent_id].name} children={categories[parent_id].children} pk={parent_id} />
    )

    return (
        <ul className="sh-categories-tree">
            {parents}
        </ul>
    )

};

export {
    CategoryTree,
};
