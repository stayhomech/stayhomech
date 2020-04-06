import React, { Suspense, useState, useEffect, useContext } from 'react';
import { 
    Row,
    Col,
    InputGroup,
    InputGroupAddon,
    Input,
    Alert
} from 'reactstrap';

import { useTranslation } from 'react-i18next';
import { Card } from './Card';
import { ReportModal } from './ReportModal';
import { Filters, SearchContext, distance_to_string } from './Filters';


const NoCardToShow = props => {

    const { t, i18n } = useTranslation();

    const searchContext = useContext(SearchContext);

    var filters = [];

    if (searchContext.filters.text != '') {
        filters.push(<li>{t('Textual search for') + ' "' + searchContext.filters.text + '".'}</li>);
    }
    if (searchContext.filters.distance < Infinity) {
        filters.push(<li>{t('Display only services that are located less than') + " " + distance_to_string(searchContext.filters.distance)}</li>);
    }
    if (searchContext.filters.category > 0) {
        const c = props.categories[searchContext.filters.category];
        var c_name = c.name;
        if (c.parent != null) {
            c_name = c.parent.name + " / " + c_name;
        }
        filters.push(<li>{t('Display only services are members of the category') + ": " + c_name}</li>);
    }

    return (
        <Alert color="warning" id="allFiltered" className="m-4">
            <p className="font-weight-bold">{t('Nothing left to show, try changing your filters.')}</p>
            <p>{t('You currently have the following filters enabled:')}</p>
            <ul>
                {filters}
            </ul>
        </Alert>
    )

}

const Page = props => {

    const { t, i18n } = useTranslation();

    const [error, setEror] = useState(null);
    const [isLoaded, setLoaded] = useState(false);
    const [businesses, setBusinesses] = useState([]);
    const [categoriesTree, setCategoriesTree] = useState({});
    const [categories, setCategories] = useState({});
    const [modals, setModals] = useState([]);
    const [npa, setNpa] = useState(null);
    const [radius, setRadius] = useState([999.0, 0.0])

    const [filterText, setFilterText] = useState('')
    const [filterDistance, setFilterDistance] = useState(Infinity)
    const [filterCategory, setFilterCategory] = useState(0)

    useEffect(() => {
        fetch("/content/" + props.content_uuid + "/")
            .then(res => res.json())
            .then(
                (result) => {

                    // Build categories tree
                    result.parent_categories.forEach(element => {
                        categoriesTree[element.id] = {
                            name: element.name,
                            children: {}
                        }
                    });
                    result.categories.forEach(element => {
                        categoriesTree[element.parent]['children'][element.id] = element.name;
                        categories[element.id] = {
                            id: element.id,
                            name: element.name,
                            parent: {
                                id: element.parent,
                                name: categoriesTree[element.parent]['name']
                            }
                        }
                    });

                    var radius = {
                        min: 999.0,
                        max: 0.0
                    }

                    // Refill categories
                    var bs = [];
                    result.businesses.forEach((business) => {

                        // Radius
                        if (radius.min > business.distance.km) {
                            radius.min = business.distance.km;
                        }
                        if (radius.max < business.distance.km) {
                            radius.max =  business.distance.km;
                        }

                        // All categories IDs and texts for filtering
                        var all_c_pks = [parseInt(business.main_category)];

                        // Main
                        business.main_category = categories[business.main_category]
                        var all_c_text = business.name + " " + business.description + " " + business.main_category.name + " " + business.main_category.parent.name;
                        all_c_pks.push(parseInt(business.main_category.parent.id))

                        // Others
                        var others = []
                        business.other_categories.forEach((category) => {
                            all_c_pks.push(parseInt(category));
                            all_c_pks.push(parseInt(categories[category].parent.id));
                            all_c_text += " " + categories[category].name;
                            all_c_text += " " + categories[category].parent.name;
                            others.push(categories[category]);
                        })
                        business.other_categories = others;

                        // Save filters
                        business.all_c_pks = all_c_pks;
                        business.all_c_text = all_c_text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

                        // Save
                        bs.push(business);

                    });

                    // Radius
                    setRadius([radius.min * 0.99, radius.max * 1.01]);

                    // Save businesses
                    setBusinesses(bs);

                    // Save NPA
                    setNpa(result.npa)

                    // Loaded
                    setLoaded(true)
                },
                (error) => {
                    setLoaded(false);
                    setEror(error);
                }
            )
    }, []);

    const reportIssue = (business) => {
        setModals(modals.concat(
            <ReportModal csrf_token={props.csrf_token} business={business} npa={npa} key={business.pk} />
        ));
    }

    if (isLoaded) {
        if (businesses.length == 0) {
            return (
            <div className="col-12 text-center" style={{ padding: '10vh' }}>
                <p className="h3">{t('No delivery service available at that location...')}</p>
                <p>{t('If you own or know a company that offers a delivery service at this location, please consider')} <a href="/add">{t('adding the service')}</a>.</p>
            </div>
            )
        } else {
   
            const searchContext = {
                filters: {
                    text: filterText,
                    distance: filterDistance,
                    category: filterCategory,
                },
                setFilters: {
                    setText: (text) => {
                        setFilterText(text);
                    },
                    setDistance: (distance) => {
                        setFilterDistance(parseFloat(distance));
                    },
                    setCategory: (category) => {
                        setFilterCategory(parseInt(category));
                    }
                }
            }

            // Build list of cards
            const cards = [];
            var stop_cards = false;
            businesses.forEach((business) => {

                if (stop_cards) { return }

                if (filterDistance > 9999 && cards.length == 25) {
                    searchContext.filters.distance = business.distance.km;
                    stop_cards = true;
                    return
                }

                // Should the card be visible ?
                var visible = true;

                // Categories filter
                if (searchContext.filters.category > 0 && !business.all_c_pks.includes(searchContext.filters.category)) { 
                    visible = false; 
                }

                // Distance filter
                if (business.distance.km > (searchContext.filters.distance + 0.1)) {
                    visible = false;
                }

                // Text filter
                var search = searchContext.filters.text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
                if (!business.all_c_text.toLowerCase().includes(search)) {
                    visible = false;
                }

                // Return
                if (visible) cards.push(<Card {...business} key={business.id} reportIssue={ reportIssue } />);
            });

            return (
            <Row>
                {modals}
                <SearchContext.Provider value={ searchContext }>
                    <Filters categoriesTree={ categoriesTree } radius={{ min: radius[0], max: radius[1] }} />
                    <div className="col-xs-12 col-md-9 p-0">
                        {(cards.length == 0) ?
                            <NoCardToShow categories={categories} />
                            :
                            cards
                        }
                    </div>
                </SearchContext.Provider>
            </Row>
            )
        }
    } else {
        return (       
            <div className="col-12 text-center" style={{ padding: '10vh' }}>
                <p className="h1"><i className="fas fa-circle-notch fa-spin"></i></p>
                <p className="h3">{t('A moment! We are looking for your results ...')}</p>
            </div>
        )
    }

}

export default Page;
