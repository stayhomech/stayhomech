import React from 'react';

const ChildItem = props => {

    return(
        <li data-selected="0" className="sh-child-c px-4 py-2 border-bottom">{props.name}</li>
    )

}

const ParentItem = props => {

    const keys = Object.keys(props.children);
    const children = keys.map((child_id) => 
        <ChildItem key={child_id.toString()} name={props.children[child_id]} />
    )

    return(
        <>
        <li data-selected="0" className="sh-parent-c px-3 py-2 border-bottom">{props.name}</li>
        <ul className="sh-child-tree">
            {children}
        </ul>
        </>
    )

}

const CategoryTree = props => {

    const categories = props.categories;

    const keys = Object.keys(categories);
    const parents = keys.map((parent_id) => 
        <ParentItem key={parent_id.toString()} name={categories[parent_id].name} children={categories[parent_id].children} />
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
