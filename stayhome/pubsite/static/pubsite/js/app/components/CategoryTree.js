import React, { useState, useContext } from 'react';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';

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
        <li className={"sh-child-c px-4 py-2 border-bottom" + selectClass } onClick={ selectCategory }>
            <KeyboardArrowRightIcon className="mr-2" />
            {props.name}
        </li>
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

    // Sort keys
    var children_keys = Object.keys(props.children);
    const sortCategories = (a, b) => {
        var name_a = props.children[a];
        var name_b = props.children[b];
        return name_a.localeCompare(name_b);
    }
    children_keys = children_keys.sort(sortCategories);

    // If we are selected, show the children
    if (selected) {
        children_keys.map((child_id) => {
            children.push(<ChildItem key={child_id} name={props.children[child_id]} pk={child_id} />);
        })
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
        <li className={"sh-parent-c p-2 border-bottom" + selectClass} onClick={ selectCategory }>
            {(selected) ?
                <KeyboardArrowDownIcon className="mr-2" />
                :
                <KeyboardArrowRightIcon className="mr-2" />
            }
            {props.name}
        </li>
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

    var keys = Object.keys(categories);

    // Sort keys
    const sortCategories = (a, b) => {
        var name_a = categories[a].name;
        var name_b = categories[b].name;
        return name_a.localeCompare(name_b);
    }
    keys = keys.sort(sortCategories);

    const parents = [];
    keys.map((parent_id) => {
        parents.push(<ParentItem key={parent_id.toString()} name={categories[parent_id].name} children={categories[parent_id].children} pk={parent_id} />);
    })

    return (
        <ul className="sh-categories-tree">
            {parents}
        </ul>
    )

};

export {
    CategoryTree,
};
