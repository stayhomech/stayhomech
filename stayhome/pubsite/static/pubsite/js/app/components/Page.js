import React, { Suspense, useState, useEffect } from 'react';
import { 
    Row,
    Col,
    InputGroup,
    InputGroupAddon,
    Input,
    Alert
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faFilter, faSearchPlus, faSearchMinus, faDotCircle } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import ReactBootstrapSlider from 'react-bootstrap-slider';

import { ErrorBoundary } from './ErrorBoundary';
import { CategoryTree } from './CategoryTree';
import { Card } from './Card';
import { ReportModal } from './ReportModal';


const NoCardToShow = props => {

    const { t, i18n } = useTranslation();

    const [visible, setVisible] = useState(false)

    return (visible) ? (
        <Alert color="warning" id="allFiltered" className="m-4">
            {t('Nothing left to show, try changing your filters.')}
        </Alert>
    ) : null;

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
                    var bs = []
                    result.businesses.forEach((business) => {

                        // Radius
                        if (radius.min > business.distance.km) {
                            radius.min = business.distance.km;
                        }
                        if (radius.max < business.distance.km) {
                            radius.max =  business.distance.km;
                        }

                        // Main
                        business.main_category = categories[business.main_category]

                        // Others
                        var others = []
                        business.other_categories.forEach((category) => {
                            others.push(categories[category]);
                        })
                        business.other_categories = others;

                        // Save
                        bs.push(business);

                    });

                    console.log([radius.min, radius.max]);
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

            const cards = businesses.map((business) =>
                <Card {...business} key={business.id} reportIssue={ reportIssue } ></Card>
            )

            return (
            <Row>
                {modals}
                <div className="col-xs-12 col-md-3 p-3" id="left-nav">
                    <div className="row border-bottom p-0">
                        <div className="col-10 col-lg-12 pt-3">
                            <div className="input-group input-group-sm mb-3">
                                <div className="input-group-prepend">
                                    <span className="input-group-text"><FontAwesomeIcon icon={faSearch}></FontAwesomeIcon></span>
                                </div>
                                <input className="form-control form-control-sm" id="searchInput" type="text" placeholder={t('Search in results')} />
                            </div>
                        </div>
                        <div className="col-2 col-lg-0 p-3 d-block d-lg-none">
                            <button className="sh-filter-toggle" type="button" data-toggle="collapse" data-target=".nav-filter" aria-expanded="false" aria-controls="collapseExample">
                                <FontAwesomeIcon icon={faFilter}></FontAwesomeIcon>
                            </button>
                        </div>
                    </div>
                    <div className="row border-bottom px-3 py-2 nav-filter">
                        <div id="slider-parent">
                            <FontAwesomeIcon icon={faDotCircle} size="xs"></FontAwesomeIcon>
                            <ReactBootstrapSlider
                                min={radius[0]}
                                max={radius[1]}
                                step={(radius[1] - radius[0]) / 10}
                                value={radius[1]} />
                            <FontAwesomeIcon icon={faDotCircle} size="lg"></FontAwesomeIcon>
                        </div>
                    </div>
                    <div className="row p-0 nav-filter">
                        <CategoryTree categories={categoriesTree}></CategoryTree>
                    </div>
                </div>
                <div className="col-xs-12 col-md-9 p-0">
                    <NoCardToShow />
                    {cards}
                </div>
            </Row>
            )
        }
    } else {
        return (       
            <div className="col-12 text-center" style={{ padding: '10vh' }}>
                <p><img src="/static/pubsite/img/search.gif" style={{ maxWidth: '10vw' }} /></p>
                <p>{t('Vincent is looking for your results...')}</p>
            </div>
        )
    }

}

export default Page;
